import { Schema } from "mongoose";

export const TimelineSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
    },
  },
  { _id: true },
);
