import { AuthModel } from "./Auth.model";
import { AuthType } from "./Auth.type";

class AuthService {
  public async createUser(Data: AuthType) {
    try {
      let createNewUser = await AuthModel.create(Data);
      return createNewUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
