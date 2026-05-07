import z from "zod";

export const AgentResponseSchema = z.object({
  name: z.string(),
  phone: z.string(),
  skills: z.array(z.string()),
  yearsOfExperience: z.number(),
  score: z.number(),
  about: z.string(),
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;
