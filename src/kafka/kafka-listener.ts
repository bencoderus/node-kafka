import { KafkaMessage } from "kafkajs";
import { kafkaConnect } from "./kafka-connect";

type KafkaMessageData = {
  topic: string;
  partition: number;
  message: KafkaMessage;
  heartbeat?: any;
  pause?: any;
};

export abstract class KafkaListener {
  protected abstract topic: string;

  /**
   * Consume messages from a kafka topic.
   *
   * @param callback
   */
  protected async consume(
    callback: (data: KafkaMessageData) => void
  ): Promise<any> {
    await kafkaConnect.consumer.subscribe({ topic: this.topic });
    await kafkaConnect.consumer.run({
      eachMessage: async (messageData) => {
        callback(messageData);
      },
    });
  }

  /**
   * Listen to messages from a kafka topic.
   */
  public abstract listen(): Promise<any>;
}
