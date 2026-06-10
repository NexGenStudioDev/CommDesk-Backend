import { Schema, ObjectId } from "mongoose";

export const PrizeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    sponsorPartnerId: {
      type: ObjectId,
      ref: "Partner",
      default: null,
    },

    criteria: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);
