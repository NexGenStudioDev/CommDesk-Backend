import { MemberModel } from "./Member.Schema";
import { MemberType } from "./Member.type";
import { MemberValidationSchema } from "./Member.Validator";

class MemberService {
  async createNewMember(Data: MemberType) {
    try {
      MemberValidationSchema.parse(Data);
      let CreateNewMember = await MemberModel.create(Data);
      if (!CreateNewMember) throw new Error("Failed to Create New Member");
      return CreateNewMember;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const memberService = new MemberService();
