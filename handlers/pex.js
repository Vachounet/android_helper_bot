const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
var BotUtils = require("../utils.js")

class PEXController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        var command = $.message.text.replace("/pe", "").trim().split(" ");

        var keywords = "";

        for (var t = 0; t < command.length; t++) {
            if (command[t].trim() !== "")
                keywords += command[t] + " ";
        }
        keywords = keywords.trim();

        request.get("https://download.pixelexperience.org/ota/" + keywords + "/pie",
            function (error, response, body) {
                var json = JSON.parse(body);

                var msg = "🔍 *PixelExperience build for " + keywords + "* \n";
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
            });
    }



    get routes() {
        return {
            'pexBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = PEXController;
