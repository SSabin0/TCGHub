import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

/* c8 ignore next */
const nodeEnv = process.env.NODE_ENV;
const envFile = path.join(process.cwd(), nodeEnv ? `.env.${nodeEnv}` : `.env`);

dotenv.config({ path: envFile, quiet: true });

export const envSchema = z.object({
  SERVER_PORT: z.coerce.number().int().min(1).max(65535),
  SERVER_SECRET: z.string(),
  DATABASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
