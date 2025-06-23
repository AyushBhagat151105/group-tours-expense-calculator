import { z } from "zod"

const envSchema = z.object({
    PORT: z.string().optional(),
    BASEURL: z.string().min(1, { message: "Base is required" }),
    NODE_ENV: z.string().min(1, { message: "NODE_ENV is required" }).optional()
})
function createENV(env: NodeJS.ProcessEnv) {
    const validationResult = envSchema.safeParse(env)

    if (!validationResult.success) {
        throw new Error(validationResult.error.message)
    }

    return validationResult.data
}

export const env = createENV(process.env)