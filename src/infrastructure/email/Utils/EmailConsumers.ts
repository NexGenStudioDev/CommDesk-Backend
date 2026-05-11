import amqp from "amqplib";

import { QueueService } from "../../queue/queue.service";

import EmailService from "./Email.utils";
import EmailTemplates from "../Templates/EmailTemplates";

import PinoLogger from "../../../core/logger/pino";
import { QueueNames } from "../../queue/queue.constant";
import { AccountBannedPayload, CommunitySignupPayload } from "./Email.Type";
import EmailPublisher from "./Email.publisher";

class EmailConsumers {
  private readonly MAX_RETRY_ATTEMPTS = 3;

  public async registerCommunitySignupConsumer(): Promise<void> {
    await QueueService.createQueue(QueueNames.COMMUNITY_SIGNUP);

    await QueueService.consumeMessages<CommunitySignupPayload>(
      QueueNames.COMMUNITY_SIGNUP,

      async (payload, message) => {
        try {
          await EmailPublisher.sendCommunitySignupEmail(payload);

          PinoLogger.info(
            {
              queue: QueueNames.COMMUNITY_SIGNUP,
              email: payload.email,
              communityName: payload.communityName,
            },
            "📨 Community signup consumed → published to EMAIL_TASK",
          );
        } catch (error) {
          PinoLogger.error(
            {
              queue: QueueNames.COMMUNITY_SIGNUP,
              email: payload.email,
              error,
            },
            "❌ Error processing community signup",
          );
        }
      },
    );

    PinoLogger.info(
      {
        queue: QueueNames.COMMUNITY_SIGNUP,
      },
      "📩 Community signup consumer started",
    );
  }

  /**
   * =========================================
   * Account Banned Consumer
   * =========================================
   */

  public async registerAccountBannedConsumer(): Promise<void> {
    await QueueService.createQueue(QueueNames.ACCOUNT_BANNED);

    await QueueService.consumeMessages<AccountBannedPayload>(
      QueueNames.ACCOUNT_BANNED,

      async (payload, message) => {
        try {
          await EmailPublisher.sendAccountBannedEmail(payload);

          PinoLogger.info(
            {
              queue: QueueNames.ACCOUNT_BANNED,
              email: payload.email,
              userName: payload.userName,
            },
            "🚫 Account banned consumed → published to EMAIL_TASK",
          );
        } catch (error) {
          PinoLogger.error(
            {
              queue: QueueNames.ACCOUNT_BANNED,
              email: payload.email,
              error,
            },
            "❌ Error processing account banned",
          );
        }
      },
    );

    PinoLogger.info(
      {
        queue: QueueNames.ACCOUNT_BANNED,
      },
      "🚫 Account banned consumer started",
    );
  }
}

export default new EmailConsumers();
