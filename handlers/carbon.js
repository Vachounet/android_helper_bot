const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');
const JSDOM = require('jsdom')
class CarbonController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.search)
    }

    search($) {

        var kb = {
            inline_keyboard: []
        };

        var keyword = $.message.text.replace("/carbon", "").trim().split(" ");

        if (keyword.length == 0 || keyword.length > 1 || keyword[0] == "") {
            $.sendMessage("Usage: /carbon device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        request.get('https://get.carbonrom.org/device-' + keyword + '.html',
            function (error, response, body) {
                var results = new JSDOM.JSDOM(body);

                var msg = "🔍 *CarbonROM Build for " + keyword + " *: \n";

                var romTable = results.window.document.querySelector("#rom-table");

                if (!romTable) {
                    $.sendMessage("No results", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                    return;
                }

                var tr = romTable.querySelectorAll("tr")[1];

                var downloadLink = tr.querySelectorAll("a")[1].href;
                var fileName = tr.querySelectorAll("a")[1].textContent;


                if (downloadLink && fileName) {
                    kb.inline_keyboard.push(
                                [{
                            text: fileName,
                            url: downloadLink
                                }]);

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId
                    });
                } else {
                    $.sendMessage("No results", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }
            });
    }

    get routes() {
        return {
            'carbonBuildHandler': 'search',
        }
    }
}

module.exports = CarbonController;
