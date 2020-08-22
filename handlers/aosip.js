const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const JSDOM = require('jsdom')
var request = require('request');
const BotUtils = require('../utils')
const config = require('../config')

class AOSIPController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.search)
    }

    search($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /aosip device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments[0];

        request.get('https://aosip.dev/' + keyword, function (err, response, body) {
            if (response.statusCode === 200) {
                var results = new JSDOM.JSDOM(body);
                var links = results.window.document.querySelectorAll('a.badge-dark');
                if (!links || links.length === 0) {
                    $.sendMessage(tg._localization.En.deviceNotFound, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }
                var msg = '';
                links.forEach(link => {
                    msg += "[" + link.href.split('/')[link.href.split('/').length - 1] + "](" + link.href + ")\n"
                })
                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            } else {
                $.sendMessage(tg._localization.En.deviceNotFound, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        })
    }

    get routes() {
        return {
            'aosipBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/aosip",
                handler: "aosipBuildHandler",
                help: "Get Android Open Source illusion Project build"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = AOSIPController;
