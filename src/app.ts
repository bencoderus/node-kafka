import * as express from "express";
import { UserCreatedEvent } from "./events/user-created.event";

const app = express();

app.get("/publish", async (req, res) => {
  const userCreated = new UserCreatedEvent();

  await userCreated.publish({
    name: "John Doe",
    email: "me@biduwe.com",
    code: Date.now().toString(),
  });

  res.send("Message published");
});

export default app;
