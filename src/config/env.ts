import dotenv from "dotenv";


dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SAULT_ROUND: string,
    JWT_EXPIRES_TIME: string,
    JWT_ACCESS_SECRET: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SAULT_ROUND", "JWT_ACCESS_SECRET", "JWT_EXPIRES_TIME", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        BCRYPT_SAULT_ROUND: process.env.BCRYPT_SAULT_ROUND as string,
        JWT_EXPIRES_TIME: process.env.JWT_EXPIRES_TIME as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,

    }
}

export const envVars = loadEnvVariables()