const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const InputFile = Telegram.InputFile;
var request = require('request');
const BotUtils = require('../utils')

class LineageController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        var command = $.message.text.replace("/lineage", "").trim().split(" ");

        var keywords = "";

        for (var t = 0; t < command.length; t++) {
            if (command[t].trim() !== "")
                keywords += command[t] + " ";
        }
        keywords = keywords.trim();



        request.get("https://download.lineageos.org/api/v1/" + keywords + "/nightly/16.0",
            function (error, response, body) {

                var builds = JSON.parse(body);

                kb.inline_keyboard.push(
                                [{
                        text: builds.response[builds.response.length - 1].filename,
                        url: builds.response[builds.response.length - 1].url
                                }]);
                kb.inline_keyboard.push(
                                [{
                        text: "Changelog",
                        url: "https://download.lineageos.org/" + keywords + "/changes"
                                }]);

                $.sendMessage("*Last build for " + keywords + "*", {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb),
                    reply_to_message_id: $.message.messageId
                });

            });

    }

    get routes() {
        return {
            'lineageBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = LineageController;
