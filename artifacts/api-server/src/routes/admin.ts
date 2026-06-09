import { Router, type IRouter } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, subjectsTable, materialsTable } from "@workspace/db";
import {
  AdminLoginBody,
  CreateSubjectBody,
  UpdateSubjectBody,
  CreateMaterialBody,
  UpdateMaterialBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET ?? "akueb-help-secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ userId: 0, isAdmin: true }, JWT_SECRET, {
    expiresIn: "7d",
  });

  req.log.info("Admin logged in");
  res.json({ token, isAdmin: true });
});

router.post(
  "/admin/classes/:classId/subjects",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawClassId = Array.isArray(req.params.classId)
      ? req.params.classId[0]
      : req.params.classId;
    const classId = parseInt(rawClassId, 10);

    const parsed = CreateSubjectBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [subject] = await db
      .insert(subjectsTable)
      .values({
        classId,
        name: parsed.data.name,
        icon: parsed.data.icon,
        description: parsed.data.description,
      })
      .returning();

    res.status(201).json(subject);
  }
);

router.put(
  "/admin/subjects/:subjectId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawSubjectId = Array.isArray(req.params.subjectId)
      ? req.params.subjectId[0]
      : req.params.subjectId;
    const subjectId = parseInt(rawSubjectId, 10);

    const parsed = UpdateSubjectBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [updated] = await db
      .update(subjectsTable)
      .set(parsed.data)
      .where(eq(subjectsTable.id, subjectId))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    res.json(updated);
  }
);

router.delete(
  "/admin/subjects/:subjectId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawSubjectId = Array.isArray(req.params.subjectId)
      ? req.params.subjectId[0]
      : req.params.subjectId;
    const subjectId = parseInt(rawSubjectId, 10);

    // Delete materials first due to foreign key constraint
    await db.delete(materialsTable).where(eq(materialsTable.subjectId, subjectId));
    const [deleted] = await db
      .delete(subjectsTable)
      .where(eq(subjectsTable.id, subjectId))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    res.status(204).end();
  }
);

router.post(
  "/admin/subjects/:subjectId/materials",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawSubjectId = Array.isArray(req.params.subjectId)
      ? req.params.subjectId[0]
      : req.params.subjectId;
    const subjectId = parseInt(rawSubjectId, 10);

    const parsed = CreateMaterialBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [material] = await db
      .insert(materialsTable)
      .values({
        subjectId,
        title: parsed.data.title,
        type: parsed.data.type,
        description: parsed.data.description,
        url: parsed.data.url,
        objectPath: parsed.data.objectPath,
      })
      .returning();

    res.status(201).json(material);
  }
);

router.put(
  "/admin/materials/:materialId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawMaterialId = Array.isArray(req.params.materialId)
      ? req.params.materialId[0]
      : req.params.materialId;
    const materialId = parseInt(rawMaterialId, 10);

    const parsed = UpdateMaterialBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [updated] = await db
      .update(materialsTable)
      .set(parsed.data)
      .where(eq(materialsTable.id, materialId))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    res.json(updated);
  }
);

router.delete(
  "/admin/materials/:materialId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawMaterialId = Array.isArray(req.params.materialId)
      ? req.params.materialId[0]
      : req.params.materialId;
    const materialId = parseInt(rawMaterialId, 10);

    const [deleted] = await db
      .delete(materialsTable)
      .where(eq(materialsTable.id, materialId))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Material not found" });
      return;
    }

    res.status(204).end();
  }
);

export default router;
