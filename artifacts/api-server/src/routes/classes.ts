import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, classesTable, subjectsTable, materialsTable } from "@workspace/db";
import { ListSubjectsParams, ListMaterialsParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/classes", async (_req, res): Promise<void> => {
  const classes = await db.select().from(classesTable).orderBy(classesTable.grade);
  res.json(classes);
});

router.get("/classes/:classId/subjects", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId;
  const params = ListSubjectsParams.safeParse({ classId: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, params.data.classId));
  if (!cls) {
    res.status(404).json({ error: "Class not found" });
    return;
  }

  const subjects = await db
    .select()
    .from(subjectsTable)
    .where(eq(subjectsTable.classId, params.data.classId))
    .orderBy(subjectsTable.name);

  res.json(subjects);
});

router.get("/subjects/:subjectId/materials", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.subjectId) ? req.params.subjectId[0] : req.params.subjectId;
  const params = ListMaterialsParams.safeParse({ subjectId: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [subject] = await db.select().from(subjectsTable).where(eq(subjectsTable.id, params.data.subjectId));
  if (!subject) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }

  const materials = await db
    .select()
    .from(materialsTable)
    .where(eq(materialsTable.subjectId, params.data.subjectId))
    .orderBy(materialsTable.type, materialsTable.title);

  res.json(materials);
});

export default router;
