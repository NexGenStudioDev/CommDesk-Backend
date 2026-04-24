import { CommunityModel } from "./Community.model";
import { CommunitySchema } from "./Community.Type";
import { CreateOrganizerZodSchema } from "./Community.Validate";

class CommunityService {
  async createNewCommunity(Data: CommunitySchema) {
    try {
      CreateOrganizerZodSchema.parse(Data);
      let createNewCommunity = await CommunityModel.create(Data);

      if (!createNewCommunity) {
        throw new Error("Failed to Create new Community");
      }

      return createNewCommunity;
    } catch (error: any) {
      throw error;
    }
  }
}

export const communityService = new CommunityService();
