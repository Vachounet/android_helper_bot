'use strict'

const config = require('./config')

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const CustomFilterCommand = Telegram.CustomFilterCommand

// Export bot as global variable
global.tg = new Telegram.Telegram(config.token, {
    localization: [require('./localization/En.json')]
})


// Default Controllers
var CallbackController = require("./handlers/callbackQuery.js")
var InlineController = require("./handlers/inline.js")
var OtherwiseController = require("./handlers/custom_commands.js")

// RSDController
var RSDController = require("./handlers/rsd.js")

// Routes
tg.router.callbackQuery(new CallbackController())
    .inlineQuery(new InlineController())
    .otherwise(new OtherwiseController())

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("https://rsdsecure-cloud.motorola.com/download/") !== -1
        }, 'rsdFilterHandler'),
        new RSDController()
    )
