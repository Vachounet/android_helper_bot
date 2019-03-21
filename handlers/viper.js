const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const InputFile = Telegram.InputFile;
var request = require('request');

let Parser = require('rss-parser');
let parser = new Parser();
const BotUtils = require('../utils')

class ViperController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        var command = $.message.text.replace("/viper", "").trim().split(" ");

        if (command.length == 0 || command.length > 1 || command[0] == "") {
            $.sendMessage("Usage: /viper device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = "";

        for (var t = 0; t < command.length; t++) {
            if (command[t].trim() !== "")
                keywords += command[t] + " ";
        }
        keywords = keywords.trim();

        (async() => {

            let feed = await parser.parseURL('https://sourceforge.net/projects/viper-project/rss?path=/' + keywords);

            var msg = "🔍   *ViperOS build for " + keywords + "*";
            for (var i = 0; i < feed.items.length; i++) {

                var item = feed.items[i];

                var fileName;
                var fileLink;

                if (item.title.toLocaleLowerCase().indexOf(keywords.toLocaleLowerCase()) !== -1 && item.title.indexOf(".md5") === -1) {

                    fileName = item.title.split("/")[2];
                    fileLink = item.link

                    break;
                }
            }

            if (!fileName || !fileLink) {
                $.sendMessage("*Device not found*", {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb),
                    reply_to_message_id: $.message.messageId
                });
            } else {
                BotUtils.sendSourceForgeLinks($, fileLink)
            }

        })();

    }

    get routes() {
        return {
            'viperBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = ViperController;
