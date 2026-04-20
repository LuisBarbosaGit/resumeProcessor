import z from "zod";

export const createResumeInputSchema = z.object({
  email: z.email("Email invalido"),
});

export const createResumeResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  status: z.literal("pending"),
});

export type CreateResumeInput = z.infer<typeof createResumeInputSchema>;
export type CreateResumeResponse = z.infer<typeof createResumeResponseSchema>;
