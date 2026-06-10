import { Schema } from "mongoose";

export const FAQSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);
