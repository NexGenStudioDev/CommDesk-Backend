import mongoose from "mongoose";

export type PermissionSchemaType = {
  name: string;
  action: "create" | "read" | "update" | "delete"; // create, read, update, delete
  resource: string; // create event , read event, update event, delete event
  description?: string;
  userId: mongoose.Schema.Types.ObjectId | null; // Reference to the user who created the permission
};

const permissionSchema = new mongoose.Schema<PermissionSchemaType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    action: {
      type: String, // create, read, update, delete
      required: true,
    },
    resource: {
      type: String, // create event , read event, update event, delete event
      required: true,
    },
    description: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true },
);

export const Permission = mongoose.model("Permission", permissionSchema);
