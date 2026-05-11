import { QueueService } from "../../queue/queue.service";

import PinoLogger from "../../../core/logger/pino";

import { env_Constant } from "../../../constants/env.constant";
import { QueueNames } from "../../queue/queue.constant";
import EmailUtils from "./Email.utils";

export type EmailPayload = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  attachments?: any[];
};

class EmailWorker {
  /**
   * =========================================
   * Configuration
   * =========================================
   */

  private readonly EMAIL_QUEUE = QueueNames.EMAIL_TASK;

  private readonly MAX_RETRY_ATTEMPTS = 3;

  private readonly transporter = EmailUtils.transporter();

  public async initialize(): Promise<void> {
    try {
      await QueueService.createQueue(this.EMAIL_QUEUE);

      await this.verifySMTPConnection();

      await QueueService.consumeMessages<EmailPayload>(
        this.EMAIL_QUEUE,

        async (payload, message) => {
          try {
            await this.sendEmail(payload);

            PinoLogger.info(
              {
                to: payload.to,
                subject: payload.subject,
              },
              "📨 Email processed successfully",
            );
          } catch (error) {
            await this.retryFailedEmail(payload, message);
          }
        },
      );

      PinoLogger.info(
        {
          queue: this.EMAIL_QUEUE,
        },
        "🚀 Email worker initialized",
      );
    } catch (error: any) {
      PinoLogger.error(
        {
          error,
        },
        "❌ Failed to initialize email worker",
      );

      throw error;
    }
  }

  /**
   * =========================================
   * Send Email
   * =========================================
   */

  private async sendEmail(payload: EmailPayload): Promise<void> {
    if (!payload.to) {
      throw new Error("Email recipient is required");
    }

    const info = await EmailUtils.transporter().sendMail({
      from: payload.from || process.env.MAIL_FROM || env_Constant.SMTP_USER,

      to: payload.to,

      subject: payload.subject,

      text: payload.text,

      html: payload.html,

      attachments: payload.attachments,
    });

    PinoLogger.info(
      {
        messageId: info.messageId,
        to: payload.to,
      },
      "✅ Email sent successfully",
    );
  }

  /**
   * =========================================
   * Retry Failed Emails
   * =========================================
   */

  private async retryFailedEmail(
    payload: EmailPayload,
    message: any,
  ): Promise<void> {
    try {
      const currentRetryCount =
        Number(message.properties.headers?.["x-retry-count"]) || 0;

      if (currentRetryCount >= this.MAX_RETRY_ATTEMPTS) {
        QueueService.nackMessage(message, false);

        PinoLogger.error(
          {
            retries: currentRetryCount,
            email: payload.to,
          },
          "💀 Email max retry attempts exceeded",
        );

        return;
      }

      await QueueService.publishToQueue(this.EMAIL_QUEUE, payload, {
        persistent: true,
        headers: {
          "x-retry-count": currentRetryCount + 1,
        },
      });

      QueueService.ackMessage(message);

      PinoLogger.warn(
        {
          retryAttempt: currentRetryCount + 1,
          email: payload.to,
        },
        "🔁 Email requeued",
      );
    } catch (error: any) {
      PinoLogger.error(
        {
          error,
        },
        "❌ Failed to retry email",
      );

      QueueService.nackMessage(message, false);
    }
  }

  /**
   * =========================================
   * Verify SMTP Connection
   * =========================================
   */

  private async verifySMTPConnection(): Promise<void> {
    try {
      await this.transporter.verify();

      PinoLogger.info("✅ SMTP connection verified");
    } catch (error: any) {
      PinoLogger.error(
        {
          error,
        },
        "❌ SMTP connection failed",
      );

      throw error;
    }
  }
}

export default new EmailWorker();
