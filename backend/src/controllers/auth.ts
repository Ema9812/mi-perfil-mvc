import { User } from '../models';
import { hashPassword, verifyPassword, generateToken } from '../services/auth';

class AuthController {
  // POST /auth/register
  public static async register(
    name: string,
    email: string,
    location: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // 1. Validaciones
    if (!name || !email || !location || !password) {
      throw new Error('All fields are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // 2. Verificar que el email no esté registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered.');
    }

    // 3. Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // 4. Crear el usuario
    const user = await User.create({
      name,
      email,
      location,
      password: hashedPassword,
    });

    // 5. Generar token
    const token = generateToken(user.id, user.email);

    // 6. Devolver usuario + token (sin la contraseña)
    return { user, token };
  }

  // POST /auth/login
  public static async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // 1. Validaciones
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    // 2. Buscar al usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    // 3. Verificar la contraseña
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials.');
    }

    // 4. Generar token
    const token = generateToken(user.id, user.email);

    return { user, token };
  }
}

export default AuthController;