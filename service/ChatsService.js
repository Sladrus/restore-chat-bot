const { sleep } = require("telegram/Helpers");
const UserBotManager = require("../telegram/UserBotManager");

class ChatsService {
  constructor() {
    this.currentAccountIndex = 0;
  }

  getNextAccount() {
    const client = UserBotManager.getClient(this.currentAccountIndex);
    this.currentAccountIndex =
      (this.currentAccountIndex + 1) % UserBotManager.clients.length;
    return client;
  }

  async getChatHistory({ chat_id, chat_url }) {
    const client = this.getNextAccount();
    await UserBotManager.joinToChat(client, chat_url);
    await sleep(1000);
    const { title, messages } = await UserBotManager.getChatHistory(
      client,
      chat_id
    );
    await sleep(1000);
    await UserBotManager.leaveChat(client, chat_id);

    return { chat_id, title, messages };
  }
}

module.exports = new ChatsService();
