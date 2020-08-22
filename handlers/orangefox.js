const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const request = require('request')
const config = require('../config')

class OrangeFoxController extends TelegramBaseController {

    getBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /of device\n*Ex.:* /of raphael", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments[0].trim()

        BotUtils.getJSON('https://api.orangefox.download/v2/device/' + keyword + '/releases/stable/last',
            function (json, err) {
                if (err) {
                    $.sendMessage(tg._localization.En.deviceNotFound, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                } else {
                    var msg = "*OrangeFox build for " + keyword + "* \n\n"
                    msg += "[" + json.file_name + "](" + json.url + ") ";
                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }
            })
    }

    get routes() {
        return {
            'orangeFoxHandler': 'getBuild',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/of",
                handler: "orangeFoxHandler",
                help: "OrangeFox recovery"
            }],
            type: config.commands_type.RECOVERY
        }
    }
}

module.exports = OrangeFoxController;
