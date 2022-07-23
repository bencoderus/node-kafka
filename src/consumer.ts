import { kafkaConnect } from "./kafka/kafka-connect";
import { UserCreatedListener } from "./listeners/user-created.listener";

const consume = async () => {
  await kafkaConnect.connect({
    broker: "localhost:9093",
    clientId: "node-kafka-client1",
    groupId: "node-kafka-group",
  });

  const userCreatedListener = new UserCreatedListener();
  await userCreatedListener.listen();
};

consume();
