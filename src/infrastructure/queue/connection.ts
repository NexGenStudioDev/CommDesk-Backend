import amqp from "amqplib";
import { env_Constant } from "../../constants/env.constant";

// RabbitMQ server
const RabbitMQ_connection = async () => {
  try {
    await amqp.connect(env_Constant.RABBITMQ_URL);
    console.log("RabbitMQ server Connected");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default RabbitMQ_connection;
