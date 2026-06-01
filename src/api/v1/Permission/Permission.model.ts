import mongoose from "mongoose";

export type PermissionSchemaType = {
  name: string;
  action: "create" | "read" | "update" | "delete"; // create, read, update, delete
  resource: string; // create event , read event, update event, delete event
  description?: string;
  level?: number; // 0..100 where 100 is master
};

export type PermissionDocument = mongoose.Document & {
  permission: PermissionSchemaType[];
  userId: string | null;
};

const permission = new mongoose.Schema<PermissionSchemaType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    action: {
      type: String, // create, read, update, delete
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    description: String,
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true },
);

const permissionSchema = new mongoose.Schema<PermissionDocument>(
  {
    permission: [permission],
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the permission
      ref: "Auth",
      default: null,
    },
  },
  { timestamps: true },
);

export const Permission = mongoose.model("Permission", permissionSchema);
