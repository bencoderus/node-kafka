import { KafkaEvent } from "../kafka/kafka-event";

type UserCreatedPayload = {
  name: string;
  email: string;
  code: string;
};

export class UserCreatedEvent extends KafkaEvent<UserCreatedPayload> {
  protected topic = "user_created";

  public async publish(data: UserCreatedPayload): Promise<any> {
    await this.produce(data);
  }
}
