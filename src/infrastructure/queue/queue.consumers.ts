import Pino_logger from "../../core/logger/pino";
import EmailConsumers from "../email/Utils/EmailConsumers";
import EmailWorker from "../email/Utils/EmailWorker";

async function Consumers() {
  try {
    await Promise.all([
      EmailConsumers.registerCommunitySignupConsumer(),
      EmailConsumers.registerAccountBannedConsumer(),
      EmailConsumers.forgotPasswordConsumer(),
      EmailWorker.initialize(),
    ]);

    Pino_logger.info("✅ All queue consumers initialized successfully");
  } catch (error: any) {
    Pino_logger.error(
      {
        error,
      },
      "❌ Failed to initialize queue consumers",
    );

    throw error;
  }
}

export default Consumers;
