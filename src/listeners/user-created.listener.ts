import { KafkaListener } from "../kafka/kafka-listener";

export class UserCreatedListener extends KafkaListener {
  protected topic = "user_created";

  public async listen(): Promise<any> {
    this.consume(async (messageData) => {
      console.log(`Message key: ${messageData.message.key}`);
      console.log(`Message: ${messageData.message.value.toString()}`);
      console.log(`Message topic: ${messageData.topic}`);
    });
  }
}
