const Router = require("express");
const ChatsController = require("../controller/ChatsController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const router = new Router();

router.post("/getChatHistory", AuthMiddleware, ChatsController.getChatHistory);

module.exports = router;
