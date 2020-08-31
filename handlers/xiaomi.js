const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const request = require('request')
const YAML = require('yaml')
const config = require('../config')

class XiaomiController extends TelegramBaseController {

    getFirmwares($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /xiaomi _device_\n*Ex.:* /xiaomi whyred", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];
        var msg = "";

        request.get("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/data/latest.yml", function (err, response, body) {

            var results = YAML.parse(body)

            console.log(results.length)

            var builds = Object.values(results).filter(result => result.codename.includes(device))

            if (builds.length > 0) {
                builds.forEach(result => {
                    msg += "*" +result.name.trim() + "*\n [" + result.link.split("/")[4].trim() + "](" + result.link.trim() + ")\n";
                    msg += "_Branch: " + result.branch + " - " + result.date + "_\n\n"
                })
                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                })
            } else {
                $.sendMessage("*No files found*", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                })
                return
            }
        })
    }

    get routes() {
        return {
            'xiaomiHandler': 'getFirmwares',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/xiaomi",
                handler: "xiaomiHandler",
                help: "Search for Xiaomi firmwares"
            }],
            type: config.commands_type.FIRMWARE
        }
    }
}

module.exports = XiaomiController;
