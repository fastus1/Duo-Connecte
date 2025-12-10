import { Router, Request, Response } from "express";
import { storage } from "../storage";

const router = Router();

router.post('/circle-payment', async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const providedSecret = req.headers['x-webhook-secret'] as string;

    console.log(`[WEBHOOK] Payment webhook called from ${req.ip} at ${new Date().toISOString()}`);

    if (!webhookSecret) {
      console.error('[WEBHOOK] WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    if (!providedSecret || providedSecret !== webhookSecret) {
      console.warn(`[WEBHOOK] Invalid secret attempt from ${req.ip}`);
      return res.status(401).json({ error: 'Non autorisé - secret invalide' });
    }

    const { event, user, payment } = req.body;

    if (event !== 'payment_received') {
      console.log(`[WEBHOOK] Unsupported event type: ${event}`);
      return res.status(400).json({ error: 'Type d\'événement non supporté' });
    }

    if (!user?.email) {
      console.log('[WEBHOOK] Missing email in payload');
      return res.status(400).json({ error: 'Email requis' });
    }

    const email = user.email.toLowerCase();

    const existingMember = await storage.getPaidMemberByEmail(email);
    if (existingMember) {
      console.log(`[WEBHOOK] Member already registered: ${email}`);
      return res.json({
        success: true,
        message: 'Membre déjà enregistré',
        email,
      });
    }

    const newMember = await storage.createPaidMember({
      email,
      paymentPlan: payment?.paywall_display_name || null,
      amountPaid: payment?.amount_paid || null,
      couponUsed: payment?.coupon_code || null,
    });

    console.log(`[WEBHOOK] New paid member registered: ${email}, plan: ${payment?.paywall_display_name || 'N/A'}`);

    return res.json({
      success: true,
      message: 'Accès activé',
      email: newMember.email,
      paymentDate: newMember.paymentDate,
    });

  } catch (error) {
    console.error('[WEBHOOK] Error processing payment:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du paiement' });
  }
});

export default router;
