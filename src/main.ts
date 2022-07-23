import app from "./app";
import { kafkaConnect } from "./kafka/kafka-connect";

const port = 3000;

const bootstrap = async () => {
  app.listen(port, async () => {
    await kafkaConnect.connect({
      broker: "localhost:9093",
      clientId: "node-kafka-client1",
      groupId: "node-kafka-group",
    });
    console.log(`Server listening on port ${port}`);
  });
};

bootstrap();
