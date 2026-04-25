import { describe, test } from "@jest/globals";
import { OrganizationData } from "../Auth/Auth.test";
import { memberUtils } from "./Member.Utils";



describe('Test Member Utils Function' , () => {
    test('Test Find Member By Email' , async () => {
        let FindMember = await memberUtils.FIND_Member_BY_EMAIL(OrganizationData.owner.email)
        expect(FindMember?._id).toBeDefined()
        expect(FindMember?.email).toBe(OrganizationData.owner.email)

    })
})