const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config")
const fs = require("fs");
const BotUtils = require('../utils');
var exec = require('child_process').exec;

class GPlayController extends TelegramBaseController {

    async download($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /gp appid/appurl", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var appId = BotUtils.getUrlParameter($.command.arguments[0], 'id') || $.command.arguments[0]

        exec('gplaycli -tu "http://auroraoss.com:8080" -d "'+appId+'" -f ' + __dirname + "/../apks/", async function callback(error, stdout, stderr) {
            if (!fs.existsSync(__dirname + "/../apks/" + appId + ".apk")) {
                $.sendMessage("Dowload file failed", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
                return;
            }

            BotUtils.uploadFile(__dirname + "/../apks/" + appId + ".apk", $)
        });
    }
    get routes() {
        return {
            'gplayHandler': 'download'
        }
    }

    get config() {
        return {
            commands: [{
                command: "/gp",
                handler: "gplayHandler",
                help: "Download apk from Google Play Store"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = GPlayController;