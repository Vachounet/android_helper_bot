const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class OneplusController extends TelegramBaseController {

    getOTA($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /op _device_\n*Supported devices* : x 1 2 3 3t 5 5t 6 6t 7 7p 7p5g", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0]
        var deviceID = this.getDeviceID(device);
        var updateType = $.command.arguments[1] ? 1 : 2

        BotUtils.getJSON("https://oxygenupdater.com/api/v2.3/mostRecentUpdateData/" + deviceID + "/" + updateType, function (json, err) {
            if (json.error) {
                $.sendMessage(json.error, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
                return
            }

            var msg = updateType === 1 ? "*Latest OTA*\n" : "*Latest Full Update*\n"
            msg += "[" + json.description.split("\n")[0].replace("#", "").trim() + "](" + json.download_url + ")"
            msg += " - Size : " + BotUtils.humanFileSize(json.download_size);
            var msg1 = msg.replace(/\[www.oneplus.com\]\{http:\/\/www.oneplus.com\/\}/g, '');
            $.sendMessage(msg1, {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
        })
    }

    getDeviceID(name) {

        var deviceID = -1;
        switch (name) {
            case "x":
                deviceID = 3
                break;
            case "1":
                deviceID = 5
                break;
            case "2":
                deviceID = 1
                break;
            case "3":
                deviceID = 2
                break;
            case "3t":
                deviceID = 6
                break;
            case "5":
                deviceID = 7
                break;
            case "5t":
                deviceID = 8
                break;
            case "6":
                deviceID = 9
                break;
            case "6t":
                deviceID = 10
                break;
            case "7":
                deviceID = 13
                break;
            case "7p":
            case "7pro":
                deviceID = 12
                break;
            case "7p5g":
                deviceID = 16
                break;
        }

        return deviceID;
    }

    get routes() {
        return {
            'oneplusOTAHandler': 'getOTA',
        }
    }
}

module.exports = OneplusController;
