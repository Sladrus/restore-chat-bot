const UserBot = require("../telegram");

class ChatsService {
  async getChatHistory({ chat_id, chat_url }) {
    await UserBot.joinToChat(chat_url);
    const messages = await UserBot.getChatHistory(chat_id);
    await UserBot.leaveChat(chat_id);

    return { chat_id, messages };
  }
}

module.exports = new ChatsService();
