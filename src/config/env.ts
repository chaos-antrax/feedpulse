import dotenv from "dotenv";

dotenv.config();

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readBooleanEnv(name: string, fallback: boolean) {
  const value = process.env[name]?.trim();

  if (!value) {
    return fallback;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(
    `Invalid ${name} value: ${value}. Expected "true" or "false".`,
  );
}

const portValue = process.env.PORT?.trim() ?? "8000";
const parsedPort = Number(portValue);

if (!Number.isInteger(parsedPort) || parsedPort <= 0 || parsedPort > 65535) {
  throw new Error(`Invalid PORT value: ${portValue}`);
}

const jwtSecret = readRequiredEnv("JWT_SECRET");

if (jwtSecret.length < 32) {
  throw new Error(
    "Environment variable JWT_SECRET must be at least 32 characters long.",
  );
}

export const env = {
  PORT: parsedPort,
  MONGO_URI: readRequiredEnv("MONGO_URI"),
  GEMINI_API_KEY: readRequiredEnv("GEMINI_API_KEY"),
  GEMINI_MODEL: readRequiredEnv("GEMINI_MODEL"),
  JWT_SECRET: jwtSecret,
  ADMIN_EMAIL: readRequiredEnv("ADMIN_EMAIL"),
  ADMIN_PASSWORD: readRequiredEnv("ADMIN_PASSWORD"),
  TRUST_PROXY: readBooleanEnv("TRUST_PROXY", false),
} as const;
