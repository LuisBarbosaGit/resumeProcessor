import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(333),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_SECRET_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.error) {
  throw new Error(
    `Missing env variables: ${JSON.stringify(_env.error.format())}`,
  );
}

export const env = _env.data;
