import { Schema } from "mongoose";

export const VenueSchema = new Schema(
  {
    mode: {
      type: String,
      enum: Object.values(EventMode),
      required: true,
    },

    venueName: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    postalCode: {
      type: String,
      trim: true,
    },

    geo: {
      type: GeoLocationSchema,
      index: "2dsphere",
    },

    meetingUrl: {
      type: String,
      trim: true,
    },

    mapUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);
