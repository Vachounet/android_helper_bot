const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var BotUtils = require("../utils.js")

class LabsController extends TelegramBaseController {

    search($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /labs _keywords_", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments.join(" ")

        BotUtils.getJSON("https://labs.xda-developers.com/api/1/search?q=" + encodeURIComponent(keywords), function (json, err) {

            var results = json.results;
            var msg = "*Labs search results:*\n";
            for (var i = 0; i < results.length; i++) {
                msg += "[" + results[i].title.trim() + " ](https://labs.xda-developers.com/store/app/" + results[i].package_name + ")   "
            }

            $.sendMessage(msg, {
                parse_mode: "markdown",
                disable_web_page_preview: true,
                reply_to_message_id: $.message.messageId
            });

        });
    }


    get routes() {
        return {
            'labsHandler': 'search',
        }
    }
}


module.exports = LabsController;
