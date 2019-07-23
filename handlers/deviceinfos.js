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
                while (deviceCount--) {
                    if (json[deviceCount].device === device || json[deviceCount].model === device) {
                        var message = json[deviceCount].brand + " " + json[deviceCount].name + "\n"
                        message += "*Codename* : " + json[deviceCount].device + "\n"
                        message += "*Model* : " + json[deviceCount].model + "\n"
                        $.sendMessage(message, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                        break;
                    }
                }
            })

    }

    getDeviceFromCodename($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /deviceinfos device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var brand = $.command.arguments[0];
        var device = $.command.arguments[1];
        if ($.command.arguments.length > 2) {
            for (var i = 2; i < $.command.arguments.length; i++) {
                device += " " + $.command.arguments[i]
            }

            device = device.trim()
            console.log(device)
        }
        BotUtils.getJSON("https://raw.githubusercontent.com/androidtrackers/certified-android-devices/master/devices.json",
            function (json, err) {
                var deviceCount = json.length
                while (deviceCount--) {
                    if (json[deviceCount].brand.toLowerCase().includes(brand.toLowerCase()) &&
                        json[deviceCount].name.toLowerCase().includes(device.toLowerCase())) {
                        var message = json[deviceCount].brand + " " + json[deviceCount].name + "\n"
                        message += "*Codename* : " + json[deviceCount].device + "\n"
                        message += "*Model* : " + json[deviceCount].model + "\n"
                        $.sendMessage(message, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                        break;
                    }
                }
            })

    }

    get routes() {
        return {
            'deviceInfosHandler': 'getDeviceInfos',
            'codenameHandler': 'getDeviceFromCodename',
        }
    }
}

module.exports = DeviceInfosController;
