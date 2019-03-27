const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const request = require('request')

class OneplusController extends TelegramBaseController {

    getOTA($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /op _device_\n*Supported devices* : x 1 2 3 3t 5 5t 6 6t", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0]
        var deviceID = this.getDeviceID(device);
        var updateType = $.command.arguments[1] ? 4 : 2

        request.get("https://oxygenupdater.com/api/v2.3/mostRecentUpdateData/" + deviceID + "/" + updateType, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {
                var update = JSON.parse(body);

                if (update.error) {
                    $.sendMessage(update.error, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                    return
                }

                var msg = "*Last Full Update*\n"
                msg += "[" + update.filename + "](" + update.download_url + ") "
                msg += "`\n\nSize: `" + BotUtils.humanFileSize(update.download_size);
                msg += "`\n\nChangelog:\n\n" + update.description + "`"
                var msg1 = msg.replace(/\[www.oneplus.com\]\{http:\/\/www.oneplus.com\/\}/g, '');
                $.sendMessage(msg1, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            });

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
