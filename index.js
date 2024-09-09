const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const bodyParser = require("body-parser");
const router = require("./router");
const UserBot = require("./telegram");
const { StoreSession } = require("telegram/sessions");
const ErrorMiddleware = require("./middleware/ErrorMiddleware");

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
  const apiId = process.env.API_ID;
  const apiHash = process.env.API_HASH;
  const storeSession = new StoreSession("./telegram/store/");

  await UserBot.initClient(storeSession, apiId, apiHash);
});
