const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

class OneplusController extends TelegramBaseController {

    getOTA($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            BotUtils.getJSON("https://oxygenupdater.com/api/v2.5/devices", function (json, err) {
                var deviceList = ""
                json.forEach(device => deviceList += " (id: " + device.id + ") " + device.product_names + "\n")
                $.sendMessage("Usage: /op deviceID\nSupported devices : " + deviceList, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId
                });
            })

            return;
        }

        var deviceID = $.command.arguments[0];
        var updateType = $.command.arguments[1] ? 1 : 2

        BotUtils.getJSON("https://oxygenupdater.com/api/v2.5/mostRecentUpdateData/" + deviceID + "/" + updateType, function (json, err) {
            if (json.error) {
                $.sendMessage(json.error, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
                return
            }

            var msg = updateType === 1 ? "*OTA*\n" : "*Full Update*\n"
            msg += "[" + json.description.split("\n")[0].replace("#", "").trim() + "](" + json.download_url + ")"
            msg += " - Size : " + BotUtils.humanFileSize(json.download_size);
            var msg1 = msg.replace(/\[www.oneplus.com\]\{http:\/\/www.oneplus.com\/\}/g, '');
            $.sendMessage(msg1, {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
        })
    }

    get routes() {
        return {
            'oneplusOTAHandler': 'getOTA',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/op",
                handler: "oneplusOTAHandler",
                help: "Get firmwares for OnePlus devices"
            }],
            type: config.commands_type.FIRMWARE
        }
    }
}

module.exports = OneplusController;
