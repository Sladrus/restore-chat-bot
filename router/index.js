const Router = require("express").Router;
const chatsRouter = require("./chatsRouter");
const mathjsRouter = require("./mathjsRouter");

const router = new Router();

router.use("/chats", chatsRouter);
router.use("/mathjs", mathjsRouter);


module.exports = router;
