import z from "zod";

export const jobStatusSchema = z.enum(["pending", "processed"]);

export const createJobBodySchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio"),
  description: z.string().min(1, "Descricao e obrigatoria"),
});

export const updateJobBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: jobStatusSchema.optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined,
    { message: "Informe ao menos um campo para atualizar" },
  );

export const jobParamsSchema = z.object({
  id: z.uuid("ID invalido"),
});

export const jobResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  status: jobStatusSchema,
  description: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export const jobsListResponseSchema = z.array(jobResponseSchema);

export type CreateJobBody = z.infer<typeof createJobBodySchema>;
export type UpdateJobBody = z.infer<typeof updateJobBodySchema>;
export type JobParams = z.infer<typeof jobParamsSchema>;
export type JobResponse = z.infer<typeof jobResponseSchema>;
