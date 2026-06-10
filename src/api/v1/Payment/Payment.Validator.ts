import { z } from "zod";

export const CreateCashFreeOrderValidate = z.object({
  orderId: z.string().trim().min(1, "Order ID is required"),

  order_amount: z.number().positive("Order amount must be greater than 0"),

  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters"),

  customerEmail: z.string().trim().email("Invalid email address"),

  customerPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  // returnUrl: z.string(),

  // notifyUrl: z.string(),
});

export type CreateCashFreeOrderInput = z.infer<
  typeof CreateCashFreeOrderValidate
>;
