import { AuthModel } from "./Auth.model";
import argon2 from "argon2";

class AuthUtils {
  public async FIND_USER_BY_EMAIL(email: string) {
    return AuthModel.findOne({ email: email });
  }
  public async getUserById(userId: string) {
    return await AuthModel.findById(userId);
  }

  public async failedLoginAttempts(userId: string): Promise<number> {
    const user = await AuthModel.findById(userId);
    if (!user) {
      throw new Error("Failed to find user");
    }

    user.failedLoginAttempts += 1;
    await user.updateOne({ failedLoginAttempts: user.failedLoginAttempts });
    return user?.failedLoginAttempts;
  }

  public async resetFailedLoginAttempts(userId: string) {
    const user = await AuthModel.findById(userId);
    if (user) {
      user.failedLoginAttempts = 0;
      await user.updateOne({ failedLoginAttempts: user.failedLoginAttempts });
    }
  }

  public async banUser(userId: string) {
    const user = await AuthModel.findById(userId);
    if (user) {
      user.isBanned = true;
      await user.updateOne({ isBanned: user.isBanned });
    }
  }

  public async unbanUser(userId: string) {
    const user = await AuthModel.findById(userId);
    if (user) {
      user.isBanned = false;
      await user.updateOne({ isBanned: user.isBanned });
    }
  }

  public async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  public async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashPassword, password);
  }
}

export const authUtils = new AuthUtils();
