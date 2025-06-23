
import { env } from "@/validators/env";
import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis

export const db: PrismaClient = globalForPrisma.prisma || new PrismaClient()

if (env.NODE_ENV !== "producation") globalForPrisma.prisma = db