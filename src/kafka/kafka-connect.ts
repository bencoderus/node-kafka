import { Consumer, Kafka, Producer } from "kafkajs";

type KafkaConnectionOptions = {
  broker?: string;
  brokers?: string[];
  clientId: string;
  groupId: string;
};

type KafkaConnection = {
  producer: Producer;
  consumer: Consumer;
};

class KafkaConnect {
  private _producer: Producer;
  private _consumer: Consumer;

  /**
   * Get an instance of the kafka consumer.
   *
   * @returns {Consumer}
   */
  public get consumer(): Consumer {
    if (!this._consumer) {
      throw new Error(
        "Unable to get consumer. Please call connect to kafka broker."
      );
    }

    return this._consumer;
  }

  /**
   * Get an instance of the kafka producer.
   *
   * @returns {Producer}
   */
  public get producer(): Producer {
    if (!this._producer) {
      throw new Error(
        "Unable to get producer. Please call connect to kafka broker."
      );
    }

    return this._producer;
  }

  /**
   * Connect to kafka broker.
   *
   * @param {KafkaConnectionOptions} options
   *
   * @returns {Promise<KafkaConnection>}
   */
  public async connect(
    options: KafkaConnectionOptions
  ): Promise<KafkaConnection> {
    const kafka = new Kafka({
      clientId: options.clientId,
      brokers: options.brokers || [options.broker],
      retry: {
        initialRetryTime: 3000,
        retries: 10,
      },
    });

    const producer = kafka.producer();
    await producer.connect();

    const consumer = kafka.consumer({ groupId: options.groupId });
    await consumer.connect();

    this._producer = producer;
    this._consumer = consumer;

    return { producer, consumer };
  }
}

export const kafkaConnect = new KafkaConnect();
