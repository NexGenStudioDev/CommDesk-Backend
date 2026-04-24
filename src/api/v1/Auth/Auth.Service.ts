import { AuthModel } from "./Auth.model";
import { AuthType } from "./Auth.type";
import { authUtils } from "./Auth.Utils";
import { ValidateAuthData } from "./Auth.validate";

class AuthService {
  public async createUser(Data: AuthType) {
    let hashPassword = await authUtils.hashPassword(Data.passwordHash);
    try {
      await ValidateAuthData.parseAsync(Data);
      let createNewUser = await AuthModel.create({
        email: Data.email,
        passwordHash: hashPassword,
        userId: Data.userId,
        role: Data.role,
      });
      return createNewUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
