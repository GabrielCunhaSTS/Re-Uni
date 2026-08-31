import { Router } from "express";
import { receberWebhookMercadoPago } from "../controllers/webhookController.js";


const router = Router();

router.post("/webhooks/mercadopago", receberWebhookMercadoPago);

export default router;