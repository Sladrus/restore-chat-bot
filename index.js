const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const bodyParser = require("body-parser");
const router = require("./router");
const ErrorMiddleware = require("./middleware/ErrorMiddleware");
const UserBotManager = require("./telegram/UserBotManager");

const PORT = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/api", router);
app.use(ErrorMiddleware);

const httpServer = createServer(app);

httpServer.listen(PORT, async () => {
  console.log(`Server ready. Port: ${PORT}`);

  await UserBotManager.addClient(
    "./telegram/store/1",
    process.env.API_ID,
    process.env.API_HASH
  );
  await UserBotManager.addClient(
    "./telegram/store/2",
    process.env.API_ID,
    process.env.API_HASH
  );
});
