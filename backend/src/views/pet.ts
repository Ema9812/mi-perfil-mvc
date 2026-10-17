import express, { Response } from 'express';
import PetController from '../controllers/pet';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

const router = express.Router();

// ⚠️ IMPORTANTE: esta ruta va ANTES de /pets/:id
// Si va después, Express toma "search" como un :id y da error.
router.get('/pets/search', async (req: AuthRequest, res: Response) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = req.query.radius ? Number(req.query.radius) : undefined;

    const pets = await PetController.searchPets(lat, lng, radius);
    res.status(200).json(pets);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /pets (protegido)
router.post('/pets', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, status, location, image, lat, lng } = req.body;
    const reporterId = req.user!.userId;

    const pet = await PetController.createPet(
      name,
      status,
      location,
      image,
      reporterId,
      lat,
      lng
    );

    res.status(201).json(pet);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /pets (público)
router.get('/pets', async (req: AuthRequest, res: Response) => {
  try {
    const pets = await PetController.getAllPets();
    res.status(200).json(pets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /pets/:id (público)
router.get('/pets/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pet = await PetController.getPetById(id);
    res.status(200).json(pet);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// PUT /pets/:id (protegido)
router.put('/pets/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.userId;
    const { name, status, location, image, lat, lng } = req.body;

    const pet = await PetController.updatePet(
      id,
      userId,
      name,
      status,
      location,
      image,
      lat,
      lng
    );

    res.status(200).json(pet);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /pets/:id (protegido)
router.delete('/pets/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.userId;

    await PetController.deletePet(id, userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;