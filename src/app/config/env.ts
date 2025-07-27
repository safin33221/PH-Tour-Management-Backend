import dotenv from "dotenv";


dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SAULT_ROUND: string,
    JWT_ACCESS_SECRET: string,
    JWT_EXPIRES_TIME: string,
    JWT_REFRESH_EXPIRED: string,
    JWT_REFRESH_SECRET: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CALLBACK_URL: string,
    EXPRESS_SESSION_SECRET: string,
    FRONTEND_URL: string,
    SSL: {
        SSL_STORE_ID: string,
        SSL_STORE_PASS: string,
        SSL_PAYMENT_API: string,
        SSL_VALIDATION_API: string,
    }
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SAULT_ROUND",
        "JWT_ACCESS_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "EXPRESS_SESSION_SECRET",
        "FRONTEND_URL",
        "SSL_STORE_ID",
        "SSL_STORE_PASS",
        "SSL_PAYMENT_API",
        "SSL_VALIDATION_API"
    ];

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
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID as string,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
        }

    }
}

export const envVars = loadEnvVariables()