const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var BotUtils = require("../utils.js")

class PEPLUSController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /peplus device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        BotUtils.getJSON("https://download.pixelexperience.org/ota_v3/" + keywords + "/pie_plus",
            function (json, err) {

                if (err)
                    return

                if (json.filename !== "" && json.url !== "") {
                    var msg = "🔍 *PixelExperience Plus build for " + keywords + "* \n";
                    msg += "*Build date*: " + BotUtils.humanDateTime(json.datetime) + "\n"
                    msg += "*File Size*: " + BotUtils.humanFileSize(json.size, true) + "\n"

                    kb.inline_keyboard.push(
                                [{
                            text: json.filename,
                            url: json.url
                                }]);

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId
                    });
                } else {
                    $.sendMessage(tg._localization.En.deviceNotFound, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }
            });
    }



    get routes() {
        return {
            'peplusBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = PEPLUSController;
