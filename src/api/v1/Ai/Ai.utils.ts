import axios from "axios";

import { SarvamAIClient } from "sarvamai";
import { env_Constant } from "../../../constants/env.constant";

class Ai_Utils {
  private static SarvamConfig = async () => {
    return new SarvamAIClient({
      apiSubscriptionKey: env_Constant.SarvamAi_ApiKey,
    });
  };

  chatWithSarvamAi = async (message: string) => {
    try {
      const sarvamClient = await Ai_Utils.SarvamConfig();

      const response = await sarvamClient.chat.completions({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: "sarvam-m",
      });

      return response.choices[0].message.content;
    } catch (err) {
      throw err;
    }
  };
}

export const ai_Utils = new Ai_Utils();
