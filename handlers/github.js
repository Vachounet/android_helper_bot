const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const request = require('request')

class GithubController extends TelegramBaseController {

    parseLink($) {

        var matches = $.message.text.match(/\bhttps?:\/\/\S+/gi);

        var tag;
        if (matches[0].indexOf("/tags/") !== -1) {
            tag = matches[0].split("/tags/")[1];
        }

        var owner = matches[0].split("/")[3];
        var repo = matches[0].split("/")[4];

        BotUtils.getJSON("https://api.github.com/repos/" + owner + "/" + repo + "/releases",
            function (json, err) {

                var item;

                if (tag) {
                    for (var i = 0; i < json.length; i++) {
                        if (json[i].tag_name === tag) {
                            item = json[i];
                        }
                    }
                } else
                    item = json[0];

                var msg = "*" + item.name + " release by " + item.author.login + " on " + item.published_at.split("T")[0] + " *: \n\n"

                for (var i = 0; i < item.assets.length; i++) {
                    msg += "Downloads: " + item.assets[i].download_count + " \n"
                    msg += "FileSize: " + BotUtils.humanFileSize(item.assets[i].size, true) + " \n"
                    //msg += "Note: \n " + item.body + " \n"
                    msg += "[" + item.assets[i].name + "](" + item.assets[i].browser_download_url + ") \n\n"
                }
                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'githubFilterHandler': 'parseLink',
        }
    }
}

module.exports = GithubController;
