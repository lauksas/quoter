import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || '3000';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || '5432';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
export const DB_DATABASE = process.env.DB_DATABASE || 'postgres';
export const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '86400';
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'my-super-secret-key';
export const ORIGIN = process.env.ORIGIN || '*';
