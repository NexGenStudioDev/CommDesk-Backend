import { Router } from "express";
import PaymentController from "./Payment.Controller";

const router = Router();

router.post(
  "/payment/create-payment-intent",
  PaymentController.createPaymentIntent,
);

router.post(
  "/payment/payment-notification",
  PaymentController.paymentNotification,
);

export { router as paymentRouter };
