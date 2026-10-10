import express, { Request, Response } from 'express';
import ProfileController from '../controllers/profile';

const router = express.Router();

// POST /profile
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { name, bio, image } = req.body;
    const newProfile = await ProfileController.createProfile(name, bio, image);
    res.status(201).json(newProfile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const profile = await ProfileController.getProfile();
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;