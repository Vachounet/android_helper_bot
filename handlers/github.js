const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const request = require('request')

class GithubController extends TelegramBaseController {

    searchRepos($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /repos device potter\n/repos vendor potter", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        BotUtils.getJSON("https://api.github.com/search/repositories?q=" + $.command.arguments.join(" ") + "&sort=updated&order=desc",
            function (json, err) {

                var msg = ""
                var count = json.items.length < 5 ? json.items.length : 5
                if (json.items && json.items.length > 0) {
                    for (var i = 0; i < count; i++) {
                        msg += "▪️ <a href='" + json.items[i].html_url + "'>" + json.items[i].full_name + "</a>\n"
                    }
                }

                $.sendMessage(msg, {
                    parse_mode: "html",
                    disable_web_page_preview: true,
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'githubSearchHandler': 'searchRepos',
        }
    }
}

module.exports = GithubController;
