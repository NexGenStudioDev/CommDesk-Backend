import { Request, Response } from "express";
import SendResponse from "../../../utils/SendResponse";
import { paymentUtils } from "./Payment.Utils";
import { CreateCashFreeOrderValidate } from "./Payment.Validator";
import { env_Constant } from "../../../constants/env.constant";

class PaymentController {
  async createPaymentIntent(req: Request, res: Response) {
    try {

      let OrderId = `order_${Date.now()}`;

      let {
        customerEmail,
        customerName,
        customerPhone,
        order_amount,
        // returnUrl,
        // notifyUrl,


      } = await CreateCashFreeOrderValidate.parseAsync({
        ...req.body,
        orderId: OrderId,
        // returnUrl: `${env_Constant.FRONTEND_URL}/billing/add-funds/response`,
        // notifyUrl: `${env_Constant.BACKEND_URL}/api/v1/payment/payment-notification`,
      });


      const paymentIntent = await paymentUtils.createCashFreeOrder({
        customerName,
        customerEmail,
        customerPhone,
        order_amount,
        orderId: OrderId,
      });

      return SendResponse.SuccessResponse(
        res,
        paymentIntent,
        "Payment intent created successfully",
      );
    } catch (error: any) {
      return SendResponse.ErrorResponse(
        res,
        "Failed to create payment intent",
        error,
      );
    }
  }


  async paymentNotification(req: Request, res: Response) {
  try {
    const payload = req.body;

    console.log("Cashfree Webhook:", payload);

    // Verify signature

    // Check payment status

    // Update payment record

    // Credit wallet

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
}


async verifyPayment(req: Request, res: Response) {
  const { orderId } = req.params;

  const result =
    await paymentUtils.fetchOrderDetails(orderId);

  return SendResponse.SuccessResponse(
    res,
    result,
    "Payment verified"
  );
}


}

export default new PaymentController();
