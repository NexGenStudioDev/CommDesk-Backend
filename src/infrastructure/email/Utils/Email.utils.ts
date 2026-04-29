import nodemailer from "nodemailer";
import { env_Constant } from "../../../constants/env.constant";

class EmailUtils {
  sendEmail = async () => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: env_Constant.SMTP_USER,
        pass: env_Constant.SMTP_PASS,
      },
    });

    return transporter;
  };

  getLoginTemplate = async () => {};
}
