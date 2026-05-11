import amqp from "amqplib";
import { env_Constant } from "../../constants/env.constant";

let connection: amqp.Connection | null = null;

// RabbitMQ connection function
const connectRabbitMQ = async (): Promise<amqp.Connection> => {
  try {
    if (connection) {
      return connection;
    }
    const conn = await amqp.connect(env_Constant.RABBITMQ_URL);
    connection = conn as unknown as amqp.Connection;
    console.log("RabbitMQ server Connected");
    return connection;
  } catch (error: any) {
    throw new Error(`RabbitMQ Connection Error: ${error.message}`);
  }
};

// Get existing connection
const getConnection = async (): Promise<amqp.Connection> => {
  if (!connection) {
    return connectRabbitMQ();
  }
  return connection;
};

export { connectRabbitMQ, getConnection };
export default connectRabbitMQ;
