const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var BotUtils = require("../utils.js")

class PECAFController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /pecaf device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        BotUtils.getJSON("https://download.pixelexperience.org/ota/" + keywords + "/pie_caf",
            function (json, err) {

                if (err)
                    return;

                if (json.filename !== "" && json.url !== "") {
                    var msg = "🔍 *PixelExperience CAF build for " + keywords + "* \n";
                    msg += "*Changelog*: \n"
                    msg += "`" + json.changelog + "`\n"
                    msg += "*Build date*: " + json.build_date + "\n"
                    msg += "*File Size*: " + BotUtils.humanFileSize(json.filesize, true) + "\n"

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
            'pecafBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = PECAFController;
