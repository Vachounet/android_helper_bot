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

// Custom Controller
var RSDController = require("./handlers/rsd.js")
var AFHController = require("./handlers/afh.js")
var GerritController = require("./handlers/gerrit.js")
var GDriveController = require("./handlers/gdrive.js")
var SourceForgeController = require("./handlers/sourceforge.js")

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

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("androidfilehost.com/?fid=") !== -1
        }, 'afhFilterHandler'),
        new AFHController()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("/c/") !== -1
        }, 'gerritFilterHandler'),
        new GerritController()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("drive.google.com") !== -1 &&
                ($.message.text.indexOf("view") !== -1 || $.message.text.indexOf("open?id=") !== -1 ||
                    $.message.text.indexOf("uc?id=") !== -1)
        }, 'gdriveFilterHandler'),
        new GDriveController()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("sourceforge.net") !== -1 &&
                $.message.text.indexOf("/download") !== -1
        }, 'sfFilterHandler'),
        new SourceForgeController()
    )
