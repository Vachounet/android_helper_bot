const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
var rp = require('request-promise');

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

                var kb = {
                    inline_keyboard: [[{
                        text: "More results",
                        url: "https://github.com/search?q=" + $.command.arguments.join(" ") + "&s=updated&o=desc"
                }]]
                };

                $.sendMessage(msg, {
                    parse_mode: "html",
                    disable_web_page_preview: true,
                    reply_markup: JSON.stringify(kb),
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    searchCommits($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /commits keywords", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        rp("https://api.github.com/search/commits?q=" + $.command.arguments.join(" ") + "&sort=updated&order=desc", {
            json: true,
            resolveWithFullResponse: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                "Accept": "application/vnd.github.cloak-preview"
            }
        }).then(function (response) {
            var msg = ""
            var json = response.body;
            var count = json.items.length < 5 ? json.items.length : 5
            if (json.items && json.items.length > 0) {
                for (var i = 0; i < count; i++) {
                    console.log(json.items[i].commit.message)
                    msg += "▪️ <a href='" + json.items[i].url + "'>" + json.items[i].commit.message.split("\n")[0] + "</a>\n"
                }
            }

            var kb = {
                inline_keyboard: [[{
                    text: "More results",
                    url: "https://github.com/search?q=" + $.command.arguments.join(" ") + "&s=updated&o=desc&type=Commits"
                }]]
            };

            $.sendMessage(msg, {
                parse_mode: "html",
                disable_web_page_preview: true,
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        });
    }

    get routes() {
        return {
            'githubSearchHandler': 'searchRepos',
            'githubCommitsHandler': 'searchCommits',
        }
    }
}

module.exports = GithubController;
