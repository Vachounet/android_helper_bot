const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');

const JSDOM = require('jsdom');
const BotUtils = require('../utils')

class RRController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        var command = $.message.text.replace("/rr", "").trim().split(" ");
        console.log(command)
        if (command.length == 0 || command.length > 1 || command[0] == "") {
            $.sendMessage("Usage: /rr device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = "";

        for (var t = 0; t < command.length; t++) {
            if (command[t].trim() !== "")
                keywords += command[t] + " ";
        }
        keywords = keywords.trim();

        request.get("https://get.resurrectionremix.com/?dir=" + keywords, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {

                var dom = new JSDOM.JSDOM(body);

                var deviceLI = dom.window.document.querySelectorAll("#directory-listing li")[dom.window.document.querySelectorAll("#directory-listing li").length - 1];

                if (deviceLI.getAttribute("data-name").indexOf("md5") != -1) {
                    deviceLI = dom.window.document.querySelectorAll("#directory-listing li")[dom.window.document.querySelectorAll("#directory-listing li").length - 2];
                }

                var kb = {
                    inline_keyboard: []
                };
                kb.inline_keyboard.push(
                    [{
                        text: deviceLI.getAttribute("data-name"),
                        url: "https://get.resurrectionremix.com/" + deviceLI.getAttribute("data-href")
                    }]);
                var msg = "🔍 *ResurrectionRemix build for " + keywords + ": *\n";
                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb),
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'rrBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = RRController;
