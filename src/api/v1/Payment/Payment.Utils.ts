import axios from "axios";

import { CashFreeOrderRequest } from "./Payment.Types";
import { env_Constant } from "../../../constants/env.constant";

class PaymentUtils {
  async createCashFreeOrder(orderRequest: CashFreeOrderRequest) {
    try {
      const response = await axios.post(
        `${env_Constant.CashFree_Url}/orders`,
        {
          order_currency: "INR",
          order_amount: orderRequest.order_amount,
          customer_details: {
            customer_id: orderRequest.orderId,
            customer_phone: orderRequest.customerPhone,
            customer_email: orderRequest.customerEmail,
            customer_name: orderRequest.customerName,
          },
          order_meta: {
            return_url: orderRequest.returnUrl,
            notify_url: orderRequest.notifyUrl,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-client-id": env_Constant.CashFresh_API_KEY,
            "x-client-secret": env_Constant.CashFresh_API_SECRET,
            "x-api-version": "2022-09-01",
          },
        },
      );
      console.log("CashFree order created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating CashFree order:", error);
      throw error;
    }
  }
}

export const paymentUtils = new PaymentUtils();
