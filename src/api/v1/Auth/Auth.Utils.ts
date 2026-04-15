import { AuthModel } from "./Auth.model";

class AuthUtils {
  public async getUserById(userId: string) {
    return await AuthModel.findById(userId);
  }

  public async failedLoginAttempts(userId: string) {
    const user = await AuthModel.findById(userId);
    if (user) {
      user.failedLoginAttempts += 1;
      await user.updateOne({ failedLoginAttempts: user.failedLoginAttempts });
    }
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
}

export const authUtils = new AuthUtils();
