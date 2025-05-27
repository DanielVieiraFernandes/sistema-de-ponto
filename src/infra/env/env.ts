import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
