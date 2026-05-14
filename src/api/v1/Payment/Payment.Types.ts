export type CashFreeOrderRequest = {
  orderId: string;
  order_amount: number;

  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl: string;
};
