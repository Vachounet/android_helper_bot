const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;


class MegaController extends TelegramBaseController {

    parseLink($) {

        var matches = $.message.text.match(/\bhttps?:\/\/\S+/gi);

        var kb = {
            inline_keyboard: []
        };

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

    get routes() {
        return {
            'megaHandler': 'parseLink',
        }
    }
}

module.exports = MegaController;
