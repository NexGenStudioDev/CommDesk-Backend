export type CommunitySignupPayload = {
  email: string;
  communityName: string;
  website?: string;
};

export type AccountBannedPayload = {
  email: string;
  userName?: string;
  unbannedAt: string | Date;
};
