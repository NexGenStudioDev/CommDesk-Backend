import { Schema, Types, model } from "mongoose";
import { EventStatus, EventVisibility, RewardType } from "./event.type";
import { ROLE_CONSTANT } from "../Auth/Auth.Constant";
import { VenueSchema } from "../Venue/Venue.Schema";
import { TicketSchema } from "../Ticket/Ticket.Schema";
import { PrizeSchema } from "../Prize/Prize.Schema";
import { TimelineSchema } from "../Timeline/Timeline.Schema";
import { FAQSchema } from "../FAQ/FAQ.Schema";
import { NextFunction } from "express-serve-static-core";

const SeoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 170,
    },

    keywords: {
      type: [String],
      default: [],
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
  },
  { _id: false },
);

const SponsorRewardSchema = new Schema(
  {
    sponsorPartnerId: {
      type: Types.ObjectId,
      ref: "Partner",
      required: true,
    },

    rewardType: {
      type: String,
      enum: Object.values(RewardType),
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    note: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

const EventPersonSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: Object.values(ROLE_CONSTANT),
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    headline: {
      type: String,
      default: "",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },

    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  },
);

const EventSchema = new Schema(
  {
    communityId: {
      type: Types.ObjectId,
      ref: "Community",
      required: true,
      index: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    /* ---------------------------------------------------------------------- */
    /*                               BASIC INFO                               */
    /* ---------------------------------------------------------------------- */

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
      index: "text",
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: 220,
      default: "",
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    descriptionMarkdown: {
      type: String,
      required: true,
    },

    descriptionHtml: {
      type: String,
      default: "",
    },

    seo: {
      type: SeoSchema,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      required: true,
      index: true,
    },

    visibility: {
      type: String,
      enum: Object.values(EventVisibility),
      default: EventVisibility.PUBLIC,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                                  MEDIA                                 */
    /* ---------------------------------------------------------------------- */

    coverImageUrl: {
      type: String,
      default: "",
    },

    bannerImageUrl: {
      type: String,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    introVideoUrl: {
      type: String,
      default: "",
    },

    /* ---------------------------------------------------------------------- */
    /*                                   TIME                                 */
    /* ---------------------------------------------------------------------- */

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    startAt: {
      type: Date,
      required: true,
      index: true,
    },

    endAt: {
      type: Date,
      required: true,
      index: true,
    },

    registrationStartAt: {
      type: Date,
      index: true,
    },

    registrationEndAt: {
      type: Date,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                                  VENUE                                 */
    /* ---------------------------------------------------------------------- */

    venue: {
      type: VenueSchema,
      required: true,
    },

    /* ---------------------------------------------------------------------- */
    /*                                TICKETING                               */
    /* ---------------------------------------------------------------------- */

    tickets: {
      type: [TicketSchema],
      default: [],
    },

    /* ---------------------------------------------------------------------- */
    /*                                  PRICING                               */
    /* ---------------------------------------------------------------------- */

    pricing: {
      totalBudget: {
        type: Number,
        default: 0,
      },

      totalPrizePool: {
        type: Number,
        default: 0,
      },

      mainPrizes: {
        type: [PrizeSchema],
        default: [],
      },

      trackPrizes: {
        type: [PrizeSchema],
        default: [],
      },

      specialPrizes: {
        type: [PrizeSchema],
        default: [],
      },

      sponsorRewards: {
        type: [SponsorRewardSchema],
        default: [],
      },
    },

    people: {
      type: [EventPersonSchema],
      default: [],
    },

    timeline: {
      type: [TimelineSchema],
      default: [],
    },

    faqs: {
      type: [FAQSchema],
      default: [],
    },

    rules: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    /* ---------------------------------------------------------------------- */
    /*                                 SETTINGS                               */
    /* ---------------------------------------------------------------------- */

    settings: {
      publicVisible: {
        type: Boolean,
        default: true,
      },

      featuredEvent: {
        type: Boolean,
        default: false,
      },

      requireApproval: {
        type: Boolean,
        default: false,
      },

      enableWaitlist: {
        type: Boolean,
        default: true,
      },

      allowTeamRegistration: {
        type: Boolean,
        default: false,
      },

      allowCancellation: {
        type: Boolean,
        default: true,
      },

      showRemainingSeats: {
        type: Boolean,
        default: true,
      },
    },

    /* ---------------------------------------------------------------------- */
    /*                                 ANALYTICS                              */
    /* ---------------------------------------------------------------------- */

    analytics: {
      viewsCount: {
        type: Number,
        default: 0,
      },

      uniqueViewsCount: {
        type: Number,
        default: 0,
      },

      registrationsCount: {
        type: Number,
        default: 0,
      },

      attendeesCount: {
        type: Number,
        default: 0,
      },

      teamsCount: {
        type: Number,
        default: 0,
      },

      submissionsCount: {
        type: Number,
        default: 0,
      },

      likesCount: {
        type: Number,
        default: 0,
      },

      sharesCount: {
        type: Number,
        default: 0,
      },
    },

    /* ---------------------------------------------------------------------- */
    /*                               MODERATION                               */
    /* ---------------------------------------------------------------------- */

    moderation: {
      isVerified: {
        type: Boolean,
        default: false,
      },

      verifiedBy: {
        type: Types.ObjectId,
        ref: "User",
      },

      verifiedAt: {
        type: Date,
      },

      moderationNote: {
        type: String,
        default: "",
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

EventSchema.index({
  title: "text",
  subtitle: "text",
  shortDescription: "text",
  tags: "text",
});

EventSchema.index({
  communityId: 1,
  status: 1,
  startAt: 1,
});

EventSchema.index({
  category: 1,
  eventType: 1,
  visibility: 1,
});

EventSchema.index({
  "venue.geo": "2dsphere",
});

EventSchema.index({
  createdAt: -1,
});

EventSchema.index({
  registrationEndAt: 1,
});

EventSchema.index({
  isDeleted: 1,
  status: 1,
});

/* -------------------------------------------------------------------------- */
/*                                MIDDLEWARES                                 */
/* -------------------------------------------------------------------------- */

EventSchema.pre("save", function (next: any) {
  if (this.endAt < this.startAt) {
    throw new Error("End date cannot be before start date");
  }

  next();
});

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const EventModel = model("Event", EventSchema);
