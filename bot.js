'use strict'

const config = require('./config')

const Telegram = require('telegram-node-bot')
const TextCommand = Telegram.TextCommand

var request = require('request');
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var followedForums = db.collection('followed_forums');

var botToken = config.token || process.env.BOT_TOKEN

// Export bot as global variable
global.tg = new Telegram.Telegram(botToken, {
    localization: [require('./localization/En.json')]
})

const BotUtils = require('./utils')

// Default Controllers
var CallbackController = require("./handlers/callbackQuery.js")
var InlineController = require("./handlers/inline.js")
var OtherwiseController = require("./handlers/custom_commands.js")

// Exports all handlers
require('fs').readdirSync(__dirname + '/handlers/').forEach(function (file) {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        try {
            var handler = require('./handlers/' + file)
            var instance = new handler()
            if (instance.config) {
                instance.config.commands.forEach(command => {
                    tg.router.when(
                        new TextCommand(command.command, command.handler, 'Display commands menu'),
                        instance
                    )
                })
            }
        } catch (ex) {
            console.log(ex)
        }
    }
});
// Routes
tg.router.callbackQuery(new CallbackController())
    .inlineQuery(new InlineController())
    .otherwise(new OtherwiseController())

