import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, admissionRequestsTable } from "@workspace/db";
import { SubmitAdmissionBody, UpdateAdmissionStatusBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.post("/admissions", async (req, res): Promise<void> => {
  const parsed = SubmitAdmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [request] = await db
    .insert(admissionRequestsTable)
    .values({
      fullName: parsed.data.fullName,
      age: parsed.data.age,
      schoolName: parsed.data.schoolName,
      grade: parsed.data.grade,
      whatsappNumber: parsed.data.whatsappNumber,
      subjects: parsed.data.subjects,
    })
    .returning();

  req.log.info({ id: request.id }, "Admission request submitted");
  res.status(201).json(request);
});

router.get("/admin/admissions", requireAdmin, async (req, res): Promise<void> => {
  const requests = await db
    .select()
    .from(admissionRequestsTable)
    .orderBy(desc(admissionRequestsTable.createdAt));

  res.json(requests);
});

router.patch(
  "/admin/admissions/:admissionId/status",
  requireAdmin,
  async (req, res): Promise<void> => {
    const admissionId = parseInt(req.params.admissionId as string, 10);

    const parsed = UpdateAdmissionStatusBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [updated] = await db
      .update(admissionRequestsTable)
      .set({ status: parsed.data.status })
      .where(eq(admissionRequestsTable.id, admissionId))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Admission request not found" });
      return;
    }

    res.json(updated);
  }
);

router.delete(
  "/admin/admissions/:admissionId",
  requireAdmin,
  async (req, res): Promise<void> => {
    const admissionId = parseInt(req.params.admissionId as string, 10);

    const [deleted] = await db
      .delete(admissionRequestsTable)
      .where(eq(admissionRequestsTable.id, admissionId))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Admission request not found" });
      return;
    }

    res.status(204).end();
  }
);

export default router;
