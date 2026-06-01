import { Schema } from "mongoose";

export const GeoLocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator(value: number[]) {
          return value.length === 2;
        },
        message: "Coordinates must contain [lng, lat]",
      },
    },
  },
  { _id: false },
);
