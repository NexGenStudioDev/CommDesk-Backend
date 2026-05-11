import amqp from "amqplib";

import { assertChannel } from "./channel";

export class QueueService {
  /**
   * =========================================
   * Queue Configuration
   * =========================================
   */

  private static readonly DEFAULT_QUEUE_OPTIONS: amqp.Options.AssertQueue = {
    durable: true,
  };

  private static readonly DEFAULT_EXCHANGE_OPTIONS: amqp.Options.AssertExchange =
    {
      durable: true,
    };

  private static readonly DEFAULT_PUBLISH_OPTIONS: amqp.Options.Publish = {
    persistent: true,
    contentType: "application/json",
  };

  private static readonly DEFAULT_CONSUME_OPTIONS: amqp.Options.Consume = {
    noAck: false,
  };

  /**
   * =========================================
   * Queue Management
   * =========================================
   */

  static async createQueue(
    queueName: string,
    options: amqp.Options.AssertQueue = this.DEFAULT_QUEUE_OPTIONS,
  ): Promise<amqp.Replies.AssertQueue> {
    try {
      const channel = assertChannel();

      return await channel.assertQueue(queueName, options);
    } catch (error: any) {
      throw new Error(
        `Failed to create queue "${queueName}": ${error.message}`,
      );
    }
  }

  static async deleteQueue(
    queueName: string,
  ): Promise<amqp.Replies.DeleteQueue> {
    try {
      const channel = assertChannel();

      return await channel.deleteQueue(queueName);
    } catch (error: any) {
      throw new Error(
        `Failed to delete queue "${queueName}": ${error.message}`,
      );
    }
  }

  static async purgeQueue(queueName: string): Promise<amqp.Replies.PurgeQueue> {
    try {
      const channel = assertChannel();

      return await channel.purgeQueue(queueName);
    } catch (error: any) {
      throw new Error(`Failed to purge queue "${queueName}": ${error.message}`);
    }
  }

  /**
   * =========================================
   * Exchange Management
   * =========================================
   */

  static async createExchange(
    exchangeName: string,
    type: "direct" | "topic" | "fanout" | "headers",
    options: amqp.Options.AssertExchange = this.DEFAULT_EXCHANGE_OPTIONS,
  ): Promise<amqp.Replies.AssertExchange> {
    try {
      const channel = assertChannel();

      return await channel.assertExchange(exchangeName, type, options);
    } catch (error: any) {
      throw new Error(
        `Failed to create exchange "${exchangeName}": ${error.message}`,
      );
    }
  }

  /**
   * =========================================
   * Queue Binding
   * =========================================
   */

  static async bindQueue(
    queueName: string,
    exchangeName: string,
    routingKey: string,
  ): Promise<void> {
    try {
      const channel = assertChannel();

      await channel.bindQueue(queueName, exchangeName, routingKey);
    } catch (error: any) {
      throw new Error(
        `Failed to bind queue "${queueName}" to exchange "${exchangeName}": ${error.message}`,
      );
    }
  }

  /**
   * =========================================
   * Publish Message To Queue
   * =========================================
   */

  static async publishToQueue<T>(
    queueName: string,
    payload: T,
    options: amqp.Options.Publish = this.DEFAULT_PUBLISH_OPTIONS,
  ): Promise<boolean> {
    try {
      const channel = assertChannel();

      const messageBuffer = Buffer.from(JSON.stringify(payload));

      return channel.sendToQueue(queueName, messageBuffer, {
        timestamp: Date.now(),
        ...options,
      });
    } catch (error: any) {
      throw new Error(
        `Failed to publish message to queue "${queueName}": ${error.message}`,
      );
    }
  }

  /**
   * =========================================
   * Publish Message To Exchange
   * =========================================
   */

  static async publishToExchange<T>(
    exchangeName: string,
    routingKey: string,
    payload: T,
    options: amqp.Options.Publish = this.DEFAULT_PUBLISH_OPTIONS,
  ): Promise<boolean> {
    try {
      const channel = assertChannel();

      const messageBuffer = Buffer.from(JSON.stringify(payload));

      return channel.publish(exchangeName, routingKey, messageBuffer, {
        timestamp: Date.now(),
        ...options,
      });
    } catch (error: any) {
      throw new Error(
        `Failed to publish message to exchange "${exchangeName}": ${error.message}`,
      );
    }
  }

  /**
   * =========================================
   * Consume Messages
   * =========================================
   */

  static async consumeMessages<T>(
    queueName: string,
    handler: (payload: T, message: amqp.ConsumeMessage) => Promise<void>,
    options: amqp.Options.Consume = this.DEFAULT_CONSUME_OPTIONS,
  ): Promise<amqp.Replies.Consume> {
    try {
      const channel = assertChannel();

      /**
       * Prevent consumer overload
       */
      channel.prefetch(10);

      return await channel.consume(
        queueName,
        async (message) => {
          if (!message) return;

          try {
            const payload: T = JSON.parse(message.content.toString());

            await handler(payload, message);

            this.ackMessage(message);
          } catch (error) {
            this.nackMessage(message);
          }
        },
        options,
      );
    } catch (error: any) {
      throw new Error(
        `Failed to consume messages from queue "${queueName}": ${error.message}`,
      );
    }
  }

  /**
   * =========================================
   * Message Acknowledgement
   * =========================================
   */

  static ackMessage(message: amqp.ConsumeMessage): void {
    const channel = assertChannel();

    channel.ack(message);
  }

  static nackMessage(message: amqp.ConsumeMessage, requeue = false): void {
    const channel = assertChannel();

    channel.nack(message, false, requeue);
  }

  /**
   * =========================================
   * Queue Utilities
   * =========================================
   */

  static async checkQueue(
    queueName: string,
  ): Promise<amqp.Replies.AssertQueue> {
    try {
      const channel = assertChannel();

      return await channel.checkQueue(queueName);
    } catch (error: any) {
      throw new Error(`Queue "${queueName}" does not exist: ${error.message}`);
    }
  }

  static getChannel(): amqp.Channel {
    return assertChannel();
  }
}

export default QueueService;
