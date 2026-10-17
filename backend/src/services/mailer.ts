import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export async function sendReportEmail(
  toEmail: string,
  ownerName: string,
  petName: string,
  reporterPhone: string,
  location: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `🐾 ¡Alguien vio a ${petName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4a90e2;">🐾 ¡Buenas noticias, ${ownerName}!</h1>
          <p>Alguien reportó haber visto a <strong>${petName}</strong>.</p>

          <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">📞 Datos del avistaje</h2>
            <p><strong>Teléfono del reportante:</strong> ${reporterPhone}</p>
            <p><strong>Ubicación:</strong> ${location}</p>
          </div>

          <p>¡Contactalo lo antes posible!</p>
          <p style="color: #666; font-size: 0.9em;">— Pet Finder</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error al enviar el email:', error);
    throw new Error('Could not send the notification email.');
  }
}