import dotenv from "dotenv";

// Carregar o arquivo .env conforme o ambiente
export const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

// App
export const ENVIRONMENT = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY || "";

// Database
export const DB_CONNECTION = process.env.DB_CONNECTION;
export const POSTGRES_CONNECTION_URL = process.env.POSTGRES_CONNECTION_URL;
export const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;
