import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth';

const router = express.Router();

// POST /auth/register
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, location, password } = req.body;
    const result = await AuthController.register(name, email, location, password);

    // Excluir el password de la respuesta
    const userWithoutPassword = { ...result.user.toJSON(), password: undefined };

    res.status(201).json({ user: userWithoutPassword, token: result.token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /auth/login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthController.login(email, password);

    const userWithoutPassword = { ...result.user.toJSON(), password: undefined };

    res.status(200).json({ user: userWithoutPassword, token: result.token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

export default router;