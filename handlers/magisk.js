const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var BotUtils = require("../utils.js")

class MagiskController extends TelegramBaseController {

    getLast($) {

        BotUtils.getJSON("https://api.github.com/repos/topjohnwu/Magisk/releases",
            function (json, err) {

                var magisk = json[0];
                var magiskManager = json[1];

                var msg = "<b>" + magisk.name + "</b> \n"
                msg += "<a href=\"" + magisk.assets[1].browser_download_url + "\">" + magisk.assets[1].name + "</a> \n"
                msg += "<a href=\"" + magisk.assets[0].browser_download_url + "\">" + magisk.assets[0].name + "</a> \n\n"

                msg += "<b>" + magiskManager.name + "</b> \n"
                msg += "<a href=\"" + magiskManager.assets[0].browser_download_url + "\">" + magiskManager.assets[0].name + "</a> \n\n"

                $.sendMessage(msg, {
                    parse_mode: "html",

                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'magiskHandler': 'getLast',
        }
    }
}

module.exports = MagiskController;
