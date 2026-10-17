import express, { Request, Response } from 'express';
import ReportController from '../controllers/report';

const router = express.Router();

// POST /reports (público, cualquiera puede reportar un avistaje)
router.post('/reports', async (req: Request, res: Response) => {
  try {
    const { petId, reporterPhone, location } = req.body;
    const report = await ReportController.createReport(
      Number(petId),
      reporterPhone,
      location
    );
    res.status(201).json(report);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /pets/:petId/reports (público)
router.get('/pets/:petId/reports', async (req: Request, res: Response) => {
  try {
    const petId = Number(req.params.petId);
    const reports = await ReportController.getReportsByPet(petId);
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;