import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { requireAuth, createRequireAdmin } from "../middleware";
import { insertSupportTicketSchema } from "@shared/schema";
import { Resend } from 'resend';

const router = Router();
const requireAdmin = createRequireAdmin(storage);

router.post("/tickets", async (req, res) => {
  try {
    const validatedTicket = insertSupportTicketSchema.parse(req.body);
    const ticket = await storage.createSupportTicket(validatedTicket);

    // Build dynamic admin URL from environment
    const appUrl = process.env.APP_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'https://localhost:5000');

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const createdDate = new Date(ticket.createdAt).toLocaleString('fr-CA', { 
          timeZone: 'America/Montreal',
          dateStyle: 'long',
          timeStyle: 'short'
        });
        
        await resend.emails.send({
          from: 'Duo Connecte <support@avancersimplement.com>',
          to: 'support@avancersimplement.com',
          subject: `[Nouveau Ticket] ${ticket.subject}`,
          html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f0f3f5; font-family: 'Inter', Arial, sans-serif;">
              <center>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 40px 0;">
                      <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">

                        <tr>
                          <td align="left" style="padding: 24px 30px; background-color: #FFFFFF; border-bottom: 1px solid #E4E7EB;">
                            <img src="https://res.cloudinary.com/dxhn08di4/image/upload/v1770574588/logo-plateforme-074491_800_x_80_px_ds17is.png"
                                 alt="Avancer Simplement"
                                 height="40"
                                 style="display: block; border: 0; height: 40px; width: auto;">
                          </td>
                        </tr>

                        <tr>
                          <td style="padding: 30px;">
                            <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #074491; font-weight: 600;">
                              Nouveau ticket de support
                            </h2>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #f5f5f5; border-radius: 8px; margin-bottom: 20px;">
                              <tr>
                                <td style="padding: 20px;">
                                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;"><strong>De :</strong> ${ticket.name} (${ticket.email})</p>
                                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;"><strong>Sujet :</strong> ${ticket.subject}</p>
                                  <p style="margin: 0; font-size: 14px; color: #333;"><strong>Date :</strong> ${createdDate}</p>
                                </td>
                              </tr>
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #fff; border: 1px solid #E4E7EB; border-radius: 8px;">
                              <tr>
                                <td style="padding: 20px;">
                                  <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #374151; font-weight: 600;">Message :</h3>
                                  <p style="margin: 0; font-size: 14px; line-height: 22px; color: #333; white-space: pre-wrap;">${ticket.description}</p>
                                </td>
                              </tr>
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px;">
                              <tr>
                                <td align="center">
                                  <a href="https://communaute.avancersimplement.com/duo-connecte-application"
                                     style="background: #074491; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; font-size: 14px;">
                                    Voir et répondre au ticket
                                  </a>
                                </td>
                              </tr>
                            </table>

                            <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                              ID du ticket : ${ticket.id}
                            </p>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
              </center>
            </body>
            </html>
          `
        });
        console.log('[RESEND] Notification email sent for ticket:', ticket.id);
      } catch (emailError) {
        console.error('[RESEND] Failed to send notification:', emailError);
      }
    }
    
    res.json({ success: true, ticketId: ticket.id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/admin/tickets", requireAdmin, async (req, res) => {
  try {
    const tickets = await storage.getAllSupportTickets();
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/admin/tickets/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const ticket = await storage.updateSupportTicketStatus(req.params.id, status);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket non trouvé" });
    }
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/tickets/:id", requireAdmin, async (req, res) => {
  try {
    await storage.deleteSupportTicket(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/admin/tickets/:id/reply", requireAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: "Le message est requis" });
    }

    const tickets = await storage.getAllSupportTickets();
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket non trouvé" });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: "Service email non configuré" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const ticketDate = new Date(ticket.createdAt).toLocaleDateString('fr-CA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const ticketId = ticket.id.slice(0, 8).toUpperCase();
    
    await resend.emails.send({
      from: 'Avancer Simplement <support@avancersimplement.com>',
      to: ticket.email,
      subject: `Re: ${ticket.subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réponse à votre demande de support</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f3f5; font-family: 'Inter', Arial, sans-serif;">
          <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
                    
                    <tr>
                      <td align="left" style="padding: 24px 30px; background-color: #FFFFFF; border-bottom: 1px solid #E4E7EB;">
                        <img src="https://res.cloudinary.com/dxhn08di4/image/upload/v1770574588/logo-plateforme-074491_800_x_80_px_ds17is.png"
                             alt="Avancer Simplement"
                             height="40"
                             style="display: block; border: 0; height: 40px; width: auto;">
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px 30px 30px; color: #000000;">
                        <h2 style="margin: 0; font-size: 18px; line-height: 26px; color: #074491; font-weight: 600;">
                          Nous avons répondu à votre demande
                        </h2>
                        <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                          Bonjour ${ticket.name},
                        </p>
                        <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                          Merci d'avoir contacté notre équipe. Voici notre réponse :
                        </p>
                        
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 12px 16px; background-color: #F0F3F5; border-radius: 6px;">
                              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #6b7280;">
                                <strong style="color: #374151;">Ticket #${ticketId}</strong> &nbsp;|&nbsp; ${ticket.subject}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <div style="margin-top: 24px; padding-left: 16px; border-left: 3px solid #074491;">
                          <p style="margin: 0; font-size: 16px; line-height: 26px; color: #333333; white-space: pre-wrap;">${message}</p>
                        </div>

                        <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 24px; color: #333333;">
                          Si vous avez d'autres questions, vous pouvez simplement répondre à cet email.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding: 24px 30px 32px 30px; font-size: 14px; line-height: 20px; color: #545861;">
                        <hr style="border: 0; border-top: 1px solid #E4E7EB; width: 100%; margin-bottom: 20px;">
                        <p style="margin: 0; font-weight: 500;">
                          Cordialement,<br>
                          <span style="color: #074491;">L'équipe Avancer Simplement</span>
                        </p>
                        <p style="margin: 20px 0 0 0; font-size: 12px; color: #9ca3af;">
                          Cet email a été envoyé en réponse à votre demande du ${ticketDate}.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </center>
        </body>
        </html>
      `
    });

    console.log('[RESEND] Reply sent to:', ticket.email, 'for ticket:', ticket.id);

    if (ticket.status === 'new') {
      await storage.updateSupportTicketStatus(ticket.id, 'in_progress');
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('[RESEND] Failed to send reply:', error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }
});

export default router;
