import { Request, Response } from "express";

import { communityUtils } from "./Community.Utils";
import SendResponse from "../../../utils/SendResponse";

class CommunityController {
  public GET_COMMUNITY_BY_AuthID = async (req: Request, res: Response) => {
    try {
      let { ownerId } = req.query;

      console.log(
        "Received request to fetch community with Owner ID:",
        ownerId,
      );

      let community = await communityUtils.GET_COMMUNITY_BY_AuthID(
        String(ownerId),
      );

      if (!community) {
        throw new Error("Community not found for the given Owner ID.");
      }

      SendResponse.SuccessResponse(
        res,
        community,
        "Community fetched successfully.",
      );
    } catch (error) {
      SendResponse.ErrorResponse(
        res,
        error,
        "An error occurred while fetching the community.",
      );
    }
  };
}

export const communityController = new CommunityController();
