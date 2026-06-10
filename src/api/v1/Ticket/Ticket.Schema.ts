import { Schema } from "mongoose";
import { TicketType } from "./Ticket.Type";

export const TicketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(TicketType),
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    quantity: {
      type: Number,
      default: null,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },

    registrationStartAt: {
      type: Date,
    },

    registrationEndAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);
