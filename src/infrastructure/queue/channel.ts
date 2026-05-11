import amqp from "amqplib";
import { getConnection } from "./connection";

let globalChannel: amqp.Channel | null = null;

/**
 * Initialize and get the global RabbitMQ channel
 * Call this once during application startup
 */
export const initializeGlobalChannel = async (): Promise<amqp.Channel> => {
  try {
    if (globalChannel) {
      return globalChannel;
    }
    const connection = await getConnection();
    if (!connection) {
      throw new Error("Failed to establish RabbitMQ connection");
    }
    const channel = await (connection as any).createChannel();
    if (!channel) {
      throw new Error("Failed to create channel");
    }
    globalChannel = channel as amqp.Channel;
    console.log("Global RabbitMQ Channel Initialized");
    return globalChannel;
  } catch (error: any) {
    throw new Error(`Failed to initialize global channel: ${error.message}`);
  }
};

/**
 * Get the global channel (returns null if not initialized)
 * Use after initializeGlobalChannel() has been called
 */
export const getGlobalChannel = (): amqp.Channel | null => {
  return globalChannel;
};

/**
 * Assert channel is initialized (throws if not)
 * Use this when you need guaranteed channel access
 */
export const assertChannel = (): amqp.Channel => {
  if (!globalChannel) {
    throw new Error(
      "Global channel not initialized. Call initializeGlobalChannel() first.",
    );
  }
  return globalChannel;
};

export default globalChannel;
