const Router = require("express").Router;
const chatsRouter = require("./chatsRouter");

const router = new Router();

router.use("/chats", chatsRouter);

module.exports = router;
