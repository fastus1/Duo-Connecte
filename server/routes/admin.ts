import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { createRequireAdmin } from "../middleware";

const router = Router();
const requireAdmin = createRequireAdmin(storage);

router.get("/feedbacks", requireAdmin, async (req, res) => {
  try {
    const feedbacks = await storage.getAllFeedbacks();
    res.json(feedbacks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/feedbacks/archived", requireAdmin, async (req, res) => {
  try {
    const feedbacks = await storage.getArchivedFeedbacks();
    res.json(feedbacks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/feedbacks/:id/archive", requireAdmin, async (req, res) => {
  try {
    await storage.archiveFeedback(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/feedbacks/:id/unarchive", requireAdmin, async (req, res) => {
  try {
    await storage.unarchiveFeedback(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/feedbacks/:id", requireAdmin, async (req, res) => {
  try {
    await storage.deleteFeedback(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/paid-members', requireAdmin, async (req: Request, res: Response) => {
  try {
    const paidMembers = await storage.getAllPaidMembers();
    return res.json({ members: paidMembers });
  } catch (error) {
    console.error('Error in GET /api/admin/paid-members:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/paid-members', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email requis' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await storage.getPaidMemberByEmail(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'Ce membre est déjà enregistré' });
    }

    const newMember = await storage.createPaidMember({
      email: normalizedEmail,
      paymentPlan: 'Manual',
      amountPaid: null,
      couponUsed: null,
    });

    const adminUser = (req as any).adminUser;
    console.log(`[ADMIN] Paid member manually added: ${normalizedEmail} by ${adminUser?.email || 'unknown'}`);

    return res.json({ success: true, member: newMember });
  } catch (error) {
    console.error('Error in POST /api/admin/paid-members:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/paid-members/:email', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    await storage.deletePaidMember(email);
    return res.json({ success: true, message: 'Membre supprimé' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/paid-members:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/delete-user/:email', requireAdmin, async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).adminUser;
    const { email } = req.params;
    const normalizedEmail = email.toLowerCase().trim();
    
    if (normalizedEmail === adminUser?.email?.toLowerCase()) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const targetUser = await storage.getUserByEmail(normalizedEmail);

    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    await storage.deletePaidMember(normalizedEmail);
    await storage.deleteUser(targetUser.id);

    console.log(`[ADMIN] User completely deleted: ${normalizedEmail} by admin: ${adminUser?.email} at ${new Date().toISOString()}`);

    return res.json({ 
      success: true, 
      message: `Utilisateur ${normalizedEmail} et toutes ses données ont été supprimés.` 
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/delete-user:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/reset-user-pin', requireAdmin, async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).adminUser;
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email requis' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const targetUser = await storage.getUserByEmail(normalizedEmail);

    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    await storage.updateUserPin(targetUser.id, null);

    console.log(`[ADMIN] PIN reset for user: ${normalizedEmail} by admin: ${adminUser?.email} at ${new Date().toISOString()}`);

    return res.json({ 
      success: true, 
      message: `NIP réinitialisé pour ${normalizedEmail}. L'utilisateur devra en créer un nouveau.` 
    });
  } catch (error) {
    console.error('Error in POST /api/admin/reset-user-pin:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
