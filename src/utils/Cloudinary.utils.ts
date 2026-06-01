import { v2 as cloudinary } from "cloudinary";
import { env_Constant } from "../constants/env.constant";

let cloudinaryConfig = cloudinary.config({
  cloud_name: env_Constant.CLOUDINARY_CLOUD_NAME,
  api_key: env_Constant.CLOUDINARY_API_KEY,
  api_secret: env_Constant.CLOUDINARY_API_SECRET,
  secure: true,
});

class CloudinaryUtils {
  async uploadImage(filePath: string) {
    return await cloudinary.uploader.upload(filePath, {
      folder: "Commdesk",
      use_filename: true,
      unique_filename: false,
    });
  }

  async deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryUtils = new CloudinaryUtils();
