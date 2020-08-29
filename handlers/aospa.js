const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

const BotUtils = require('../utils')
const config = require('../config')

class PAController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.search)
    }

    search($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /pa device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0]

        BotUtils.getJSON("https://api.aospa.co/updates/" + device, function (json, err) {
            if (err || json.updates.length === 0) {
                $.sendMessage("Device not found", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
                return;
            }

            var build = json.updates.reverse().pop();
            let message = "*AOSPA build for " + device + " *: \n\n"
            message += "[" + build.name + "](" + build.url + ")"
            $.sendMessage(message, {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });

        })

    }

    get routes() {
        return {
            'paBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/pa",
                handler: "paBuildHandler",
                help: "Get Paranoid Android (AOSPA) builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = PAController;
