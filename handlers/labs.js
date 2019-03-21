const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');

class LabsController extends TelegramBaseController {

    search($) {

        var keyword = $.message.text.replace("/labs ", "").trim();

        request.get("https://labs.xda-developers.com/api/1/search?q=" + encodeURIComponent(keyword), function (error, response, body) {
            var json = JSON.parse(body);
            var results = json.results;
            var msg = "*Labs search results:*\n";
            for (var i = 0; i < results.length; i++) {
                if (results[i] && results[i].title && results[i].title.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
                    msg += "[" + results[i].title.trim() + " ](https://labs.xda-developers.com/store/app/" + results[i].package_name + ")   "
                }
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
