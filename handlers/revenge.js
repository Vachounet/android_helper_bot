const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');
const JSDOM = require('jsdom');

class RevengeController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.search)
    }

    search($) {

        var kb = {
            inline_keyboard: []
        };


        var keyword = $.message.text.replace("/revenge", "").trim().split(" ");

        if (keyword.length == 0 || keyword.length > 1 || keyword[0] == "") {
            $.sendMessage("Usage: /revenge device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        request.get(
            'https://osdn.net/projects/revengeos/storage/' + keyword, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {

                var dom = new JSDOM.JSDOM(body);

                var lastFile = dom.window.document.querySelectorAll("#filelist a")[dom.window.document.querySelectorAll("#filelist a").length - 2];
                console.log(lastFile)
                if (lastFile) {
                    var msg = "🔍 *RevengeOS Build for " + keyword + " *: \n";

                    kb.inline_keyboard.push(
                        [{
                            text: lastFile.textContent,
                            url: "https://osdn.net" + lastFile.href
                        }]);

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId
                    });
                } else {
                    $.sendMessage("*Device not found*", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }





            });
    }

    get routes() {
        return {
            'revengeBuildHandler': 'search',
        }
    }
}

module.exports = RevengeController;
