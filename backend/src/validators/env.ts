import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  BASEURL: z.string().min(1, { message: "Base is required" }).optional(),
  FRONTEND_URL: z.string().min(1, { message: "FRONTEND_URL is required" }),
  NODE_ENV: z.string().min(1, { message: "NODE_ENV is required" }).optional(),
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
  ACCESSTOKEN: z.string().min(1, { message: "ACCESSTOKEN is required" }),
  REFRESHTOKEN: z.string().min(1, { message: "REFRESHTOKEN is required" }),
  ACCESSTOKEN_EXPIRE: z
    .string()
    .min(1, { message: "ACCESSTOKEN_EXPIRE is required" }),
  REFRESHTOKEN_EXPIRE: z
    .string()
    .min(1, { message: "REFRESHTOKEN_EXPIRE is required" }),
  MAILTRAP_USER: z.string().min(1, { message: "MAILTRAP_USER is required" }),
  MAILTRAP_PASS: z.string().min(1, { message: "MAILTRAP_PASS is required" }),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, { message: "GOOGLE_CLIENT_ID is required" }),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, { message: "GOOGLE_CLIENT_SECRET is required" }),
  BACKEND_URL: z.string().min(1, { message: "BACKEND_URL is required" }),
  SESSION_SECRET: z.string().min(1, { message: "SESSION_SECRET is required" }),
});
function createENV(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env);

  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }

  return validationResult.data;
}

export const env = createENV(process.env);
