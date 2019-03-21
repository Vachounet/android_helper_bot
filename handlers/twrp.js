const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');

class TWRPController extends TelegramBaseController {

    search($) {

        var kb = {
            inline_keyboard: []
        };


        var keyword = $.message.text.replace("/twrp ", "").trim();

        request.get("https://twrp.me/search.json", function (error, response, body) {
            var json = JSON.parse(body)

            var msg = "";
            for (var i = 0; i < json.length; i++) {
                if (json[i].title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                    kb.inline_keyboard.push(
                        [{
                            text: json[i].desc,
                            url: "https://dl.twrp.me/" + json[i].title.split("(")[1].replace(")", "")
                        }]);
                }
            }

            if (kb.inline_keyboard.length > 0) {
                $.sendMessage("🔍 *TWRP Search Result(s):*", {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb),
                    reply_to_message_id: $.message.messageId
                });
            } else {
                $.sendMessage("Device not found", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        });
    }

    get routes() {
        return {
            'twrpHandler': 'search',
        }
    }
}



module.exports = TWRPController;
