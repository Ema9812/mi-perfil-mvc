import { Report, Pet, User } from '../models';
import { sendReportEmail } from '../services/mailer';

class ReportController {
  // POST /reports
  public static async createReport(
    petId: number,
    reporterPhone: string,
    location: string
  ): Promise<Report> {
    // 1. Validaciones
    if (!petId || !reporterPhone || !location) {
      throw new Error('petId, reporterPhone and location are required.');
    }

    // 2. Buscar la mascota
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      throw new Error('Pet not found.');
    }

    // 3. Verificar que esté perdida
    if (pet.status !== 'lost') {
      throw new Error('This pet is not reported as lost.');
    }

    // 4. Crear el reporte
    const report = await Report.create({
      petId,
      reporterPhone,
      location,
      timestamp: new Date(),
    });

    // 5. Enviar email al dueño (sin bloquear la respuesta si falla)
    const owner = await User.findByPk(pet.reporterId);
    if (owner) {
      sendReportEmail(owner.email, owner.name, pet.name, reporterPhone, location)
        .catch((error) => console.error('Error al enviar el email:', error));
    }

    return report;
  }

  // GET /pets/:petId/reports
  public static async getReportsByPet(petId: number): Promise<Report[]> {
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      throw new Error('Pet not found.');
    }

    return Report.findAll({
      where: { petId },
      order: [['timestamp', 'DESC']],
    });
  }
}

export default ReportController;