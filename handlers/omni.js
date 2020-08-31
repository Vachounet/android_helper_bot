const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');
const BotUtils = require('../utils')
var config = require("../config.js")

class OmniController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /omni device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments[0]

        BotUtils.getJSON("http://dl.omnirom.org/json.php", function(json, err) {
            var msg = "";
            var device = json['.\/'+keyword]
            var deviceTmp = json['.\/tmp']['.\/tmp\/'+keyword]
            if (!device && !deviceTmp) {
                $.sendMessage('Device not found', {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
                return
            }
            if (device && device.length > 0) {
                let build = device.filter(device => device.filename.endsWith(".zip")).pop()
                msg += "["+build.filename.split("/")[build.filename.split("/").length -1]+"](https://dl.omnirom.org/"+build.filename+")"
            }
            if (deviceTmp && deviceTmp.length > 0) {
                let build = deviceTmp.filter(deviceTmp => deviceTmp.filename.endsWith(".zip")).pop()
                msg += "\n["+build.filename.split("/")[build.filename.split("/").length -1]+"](https://dl.omnirom.org/"+build.filename+")"
            }

            $.sendMessage(msg, {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
        })
    }

    get routes() {
        return {
            'omniBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/omni",
                handler: "omniBuildHandler",
                help:"Get OmniROM builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = OmniController;
