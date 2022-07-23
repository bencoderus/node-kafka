import { kafkaConnect } from "./kafka-connect";
import * as crypto from "crypto";

type MessageOptions = {
  headers?: Record<string, string>;
};

type PublishedMessage = {
  topic: string;
  messageId: string;
  message: any;
  options?: MessageOptions;
};

export abstract class KafkaEvent<EventData> {
  protected abstract topic: string;

  /**
   * Publish event message to a kafka topic.
   *
   * @param {any} data
   *
   * @returns {Promise<any>}
   */
  public abstract publish(data: any): Promise<any>;

  /**
   * Publish message to a kafka topic.
   *
   * @param {EventData} data
   * @param {MessageOptions} options
   *
   * @returns {Promise<PublishedMessage>}
   */
  protected async produce(
    data: EventData,
    options?: MessageOptions
  ): Promise<PublishedMessage> {
    const messageId = crypto.randomUUID();
    const message = this.transformData(data);

    const messageData = {
      key: messageId,
      value: message,
      ...options,
    };

    await kafkaConnect.producer.send({
      topic: this.topic,
      messages: [messageData],
    });

    return {
      messageId,
      topic: this.topic,
      message: data,
      options,
    };
  }

  /**
   * Publish multiple messages to a kafka topic.
   *
   * @param {EventData} data
   * @param {MessageOptions} options
   *
   * @returns {Promise<PublishedMessage>}
   */
  protected async produceBatch(
    data: EventData[],
    options?: MessageOptions
  ): Promise<PublishedMessage[]> {
    const messages = data.map((value) => {
      return {
        key: crypto.randomUUID(),
        value: this.transformData(value),
        ...options,
      };
    });

    await kafkaConnect.producer.send({
      topic: this.topic,
      messages,
    });

    return messages.map((value, index) => {
      return {
        messageId: value.key,
        topic: this.topic,
        message: data[index],
        options,
      };
    });
  }

  /**
   * Transform data to a string.
   *
   * @param {any} data
   *
   * @returns {string}
   */
  private transformData(data: any): string {
    if (typeof data === "string") {
      return data;
    }

    return JSON.stringify(data);
  }
}
