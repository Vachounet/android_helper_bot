const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var BotUtils = require("../utils.js")
var request = require("request")
var requestPromise = require("request-promise")

class DeviceInfosController extends TelegramBaseController {

    getDeviceInfos($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /deviceinfos device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];
        BotUtils.getJSON("https://raw.githubusercontent.com/androidtrackers/certified-android-devices/master/devices.json",
            function (json, err) {
                var deviceCount = json.length
                console.log("device count " + deviceCount)
                while (deviceCount--) {
                    if (json[deviceCount].device === device || json[deviceCount].model === device) {
                        var message = json[deviceCount].brand + json[deviceCount].name + "\n"
                        message += "*Codename* : " + json[deviceCount].device + "\n"
                        message += "*Model* : " + json[deviceCount].model + "\n"
                        $.sendMessage(message, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                    }
                }
            })

    }

    get routes() {
        return {
            'deviceInfosHandler': 'getDeviceInfos',
        }
    }
}

module.exports = DeviceInfosController;
