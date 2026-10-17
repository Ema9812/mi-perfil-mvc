import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-temporal-cambiar';
const SALT_ROUNDS = 10;

// 1. Hashear contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// 2. Comparar contraseña con el hash guardado
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 3. Generar un JWT para el usuario
export function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

// 4. Verificar un JWT (para el middleware)
export function verifyToken(token: string): { userId: number; email: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
}