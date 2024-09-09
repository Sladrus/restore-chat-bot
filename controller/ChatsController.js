const ChatsService = require("../service/ChatsService");

class ChatsController {
  async getChatHistory(req, res, next) {
    try {
      const body = req.body;
      const result = await ChatsService.getChatHistory(body);
      return res.json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = new ChatsController();
