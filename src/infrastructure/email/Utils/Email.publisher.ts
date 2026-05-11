import Pino_logger from "../../../core/logger/pino";
import { QueueNames } from "../../queue/queue.constant";
import { QueueService } from "../../queue/queue.service";
import EmailTemplates from "../Templates/EmailTemplates";
import { AccountBannedPayload, CommunitySignupPayload } from "./Email.Type";

class EmailPublisher {
  public async sendCommunitySignupEmail(
    payload: CommunitySignupPayload,
  ): Promise<void> {
    console.log("Publishing community signup email with payload:", payload);
    const template = EmailTemplates.communitySignup({
      email: payload.email,

      communityName: payload.communityName,

      website: payload.website,
    });

    let a = await QueueService.publishToQueue(QueueNames.EMAIL_TASK, {
      to: payload.email,

      subject: template.subject,

      html: template.html,

      text: template.text,
    });

    console.log("Publish result:", a);

    Pino_logger.info(
      {
        email: payload.email,

        communityName: payload.communityName,
      },
      "📨 Community signup email queued",
    );
  }

  public async sendAccountBannedEmail(
    payload: AccountBannedPayload,
  ): Promise<void> {
    const unbannedAt =
      typeof payload.unbannedAt === "string"
        ? new Date(payload.unbannedAt)
        : payload.unbannedAt;

    const template = EmailTemplates.accountBanned({
      email: payload.email,

      userName: payload.userName,

      unbannedAt,
    });

    await QueueService.publishToQueue(QueueNames.EMAIL_TASK, {
      to: payload.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    Pino_logger.info(
      {
        email: payload.email,
      },
      "📨 Account banned email queued",
    );
  }
}

export default new EmailPublisher();
