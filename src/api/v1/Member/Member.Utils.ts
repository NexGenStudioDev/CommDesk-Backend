import { MemberModel } from "./Member.Schema";

class MemberUtils {
  Is_Member_Exist = async (email: string) => {
    let FindMember = await MemberModel.findOne({ email: email });
    return !!FindMember;
  };

  FIND_Member_BY_EMAIL = async (Email: string) => {
    return await MemberModel.findOne({ email: Email });
  };
}

export const memberUtils = new MemberUtils();
