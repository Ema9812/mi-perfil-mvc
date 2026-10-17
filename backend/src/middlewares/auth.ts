import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';

// Extendemos el tipo Request de Express para incluir "user"
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // 1. Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token not provided.' });
      return;
    }

    // 2. Extraer el token (quitando "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Verificar el token
    const decoded = verifyToken(token);

    // 4. Adjuntar el usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    // 5. Continuar al siguiente handler
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}