/*
 * moleculer-telegram
 * Copyright (c) 2020 George (https://github.com/gosha2602/moleculer-telegram)
 * MIT Licensed
 */

"use strict";
const TelegramBot = require("node-telegram-bot-api");
/*
 * @typedef {import('node-telegram-bot-api').TelegramBot} TelegramBot
 */
require("dotenv").config();
module.exports = {
  name: "telegram",
  /**
   * @type {TelegramBot}
   */
  bot: undefined,
  /**
   * Default settings
   */
  settings: {
    botToken: process.env.TELEGRAM_TOKEN,
    botOptions: {
      polling: false,
    },
  },

  /**
   * Actions
   */
  actions: {
    test(ctx) {
      return "Hello " + (ctx.params.name || "Anonymous");
    },
    getWebHook: {
      async handler(ctx) {
        return await this.bot.getWebHook();
      },
    },
    setWebHook: {
      params: {
        url: {
          type: "string",
        },
        options: {
          type: "object",
          optional: true,
          default: {},
        },
        fileOptions: {
          type: "object",
          optional: true,
          default: {},
        },
      },
      async handler(ctx) {
        return await this.bot.setWebHook(
          ctx.params.url,
          ctx.params.options,
          ctx.params.fileOptions
        );
      },
    },
    sendMessage: {
      params: {
        chatId: {
          type: "string",
        },
        message: {
          type: "string",
          min: 1,
          max: 4096,
        },
        options: {
          type: "object",
          optional: true,
        },
      },
      async handler(ctx) {
        const options = ctx.params.options || {};
        return await this._sendMessage(
          ctx.params.chatId,
          ctx.params.message,
          options
        );
      },
    },
  },

  /**
   * Methods
   */
  methods: {
    onMessage(msg) {
      console.log(msg);
    },
    async _sendMessage(chatId, text, options = {}) {
      return await this.bot.sendMessage(chatId, text, options);
    },
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
    if (this.settings.botToken == null)
      this.logger.warn(
        "The `botToken` is not configured. Please set the 'TELEGRAM_TOKEN' environment variable!"
      );

    return this.Promise.resolve();
  },

  /**
   * Service started lifecycle event handler
   */
  started() {
    this.bot = new TelegramBot(this.settings.botToken);

    return this.Promise.resolve();
  },

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {
    /* istanbul ignore next */
    return this.Promise.resolve();
  },
};
