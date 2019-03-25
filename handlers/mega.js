const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var exec = require('child_process').exec;

class MegaController extends TelegramBaseController {

    parseLink($) {

        var matches = $.message.text.match(/\bhttps?:\/\/\S+/gi);

        var kb = {
            inline_keyboard: []
        };

        if ($.message.chat.type === "private") {
            exec(__dirname + "/../megadown '" + matches[0] + "'", function callback(error, stdout, stderr) {
                var json = JSON.parse(stdout);

                tg.api.sendMessage($.message.from.id, "*Download Link* :\n[" + json.file_name + "](" + json.url + ")", {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb)
                });


            });
        } else {

            kb.inline_keyboard.push(
                    [{
                    text: "Click here to get it throught PM",
                    callback_data: "mega|" + matches[0].split("#")[1]
                    }]);

            $.sendMessage("*Generate download link* ", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        }

    }

    get routes() {
        return {
            'megaHandler': 'parseLink',
        }
    }
}

module.exports = MegaController;
