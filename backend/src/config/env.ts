// backend/src/config/env.ts

import { SignOptions } from 'jsonwebtoken';

function getEnvVar(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${key}`);
  }

  return value;
}

export const env = {
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN') as SignOptions['expiresIn'],
    PORT: process.env.PORT || '3000',
};