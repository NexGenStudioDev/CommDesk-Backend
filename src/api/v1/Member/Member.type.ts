type onBoardingSourceType =
  | "website"
  | "referral"
  | "social_media"
  | "event"
  | "direct_invitation"
  | "other";

type memberStatusType =
  | "On Boarding"
  | "inactive"
  | "Active"
  | "Suspended"
  | "Banned";

export type MemberType = {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  publicProfileUrl?: string;
  AuthId?: string;
  email: string;
  membershipStatus: memberStatusType;
  onboardingSource: onBoardingSourceType;
  primaryRole?: string;
  location?: string;
  skills?: string[];
  areaOfInterest?: string[];
  internalNotes?: string;
  permissions_id?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
