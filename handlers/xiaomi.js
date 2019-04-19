const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

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

        BotUtils.getJSON("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_recovery/stable_recovery.json", function (results, err) {

            var stable = results.filter(result => result.codename.indexOf(device) !== -1)

            if (stable.length > 0) {
                msg += "*Stable* \n"
                stable.forEach(result => {
                    msg += "[" + result.filename + "](" + result.download + ")\n";
                })
            } else {
                $.sendMessage("*No files found*", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                })
                return
            }


            BotUtils.getJSON("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_recovery/weekly_recovery.json", function (results, err) {
                var weekly = results.filter(result => result.codename.indexOf(device) !== -1)

                if (weekly.length > 0) {

                    msg += "\n*Weekly*\n";

                    weekly.forEach(result => {
                        msg += "[" + result.filename + "](" + result.download + ")\n";
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
                }

            })
        })
    }

    get routes() {
        return {
            'xiaomiHandler': 'getFirmwares',
        }
    }
}

module.exports = XiaomiController;
