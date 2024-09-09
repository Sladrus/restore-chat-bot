const { TelegramClient, Api } = require("telegram");
const input = require("input");
const { NewMessage } = require("telegram/events");

require("dotenv").config();

class UserBot {
  constructor() {
    this.client = null;
  }

  async initClient(storeSession, apiId, apiHash) {
    this.client = new TelegramClient(storeSession, Number(apiId), apiHash, {
      connectionRetries: 5,
    });
    await this.client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    this.client.session.save();
    console.log("Session saved.");
  }

  async joinToChat(chat_url) {
    try {
      const hash = chat_url.split("/").pop().replace("+", "");

      await this.client.invoke(
        new Api.messages.ImportChatInvite({ hash: hash })
      );
    } catch (error) {
      console.error("Failed to join chat:", error);
    }
  }

  async leaveChat(chat_id) {
    try {
      const chat = await this.client.getEntity(chat_id);

      await this.client.invoke(
        new Api.channels.LeaveChannel({
          channel: chat,
        })
      );
    } catch (error) {
      console.error("Failed to leave chat:", error);
    }
  }

  async getChatHistory(chat_id) {
    try {
      const chat = await this.client.getEntity(chat_id);
      const messages = [];
      const userCache = {};
      let offsetId = 0;
      const limit = 10;
      let moreMessages = true;

      while (moreMessages) {
        const history = await this.client.getMessages(chat, {
          limit: limit,
          offsetId: offsetId,
        });

        if (history.length < limit) {
          moreMessages = false;
        }

        for (const message of history) {
          const action = message?.action && message?.action?.className;
          const type = message?.message
            ? "text"
            : message?.media
            ? "photo"
            : "event";
          let text = message?.message;
          let user = null;
          let username = null;
          let fullname = null;

          if (message.senderId) {
            if (userCache[message.senderId]) {
              user = userCache[message.senderId];
              username = user.username;
              fullname = user.fullname;
            } else {
              try {
                const fetchedUser = await this.client.getEntity(
                  message.senderId
                );
                username = fetchedUser?.username || null;
                fullname =
                  fetchedUser?.firstName + " " + (fetchedUser?.lastName || "");

                userCache[message.senderId] = {
                  username: username,
                  fullname: fullname,
                };
              } catch (err) {
                console.error(
                  `Failed to get user entity for ID ${message.senderId}:`,
                  err
                );
              }
            }
          }

          if (type === "event") {
            if (action === "MessageActionChatJoinedByLink")
              text = `Пользователь ${fullname} вошел в чат`;
            if (action === "MessageActionChatDeleteUser")
              text = `Пользователь ${fullname} вышел из чата`;
            if (action === "MessageActionChatEditTitle") {
              const newTitle = message?.action?.title;
              text = `Название чата сменилось на "${newTitle}"`;
            }
          }

          text = type === "photo" ? "Медиа файл" : text;

          messages.push({
            message_id: message.id,
            user_id: Number(message.senderId),
            text: text,
            type,
            action,
            date: message.date,
            username: username,
            fullname: fullname,
          });
        }

        if (history.length > 0) {
          offsetId = history[history.length - 1].id;
        } else {
          moreMessages = false;
        }
      }

      return messages;
    } catch (error) {
      console.error("Failed to get chat history:", error);
    }
  }
}

module.exports = new UserBot();
