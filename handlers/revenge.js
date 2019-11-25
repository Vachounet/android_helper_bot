const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');
const JSDOM = require('jsdom');
const BotUtils = require('../utils')
const config = require('../config')

class RevengeController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.search)
    }

    search($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /revenge device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments[0];

        request.get(
            'https://osdn.net/projects/revengeos/storage/' + keyword, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {

                var dom = new JSDOM.JSDOM(body);

                var lastFile = dom.window.document.querySelectorAll("#filelist a")[dom.window.document.querySelectorAll("#filelist a").length - 2];

                if (lastFile) {
                    var msg = "🔍 *RevengeOS Build for " + keyword + " *: \n";

                    kb.inline_keyboard.push(
                        [{
                            text: lastFile.textContent,
                            url: "https://osdn.net" + lastFile.href
                        }]);

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId
                    });
                } else {
                    $.sendMessage(tg._localization.En.deviceNotFound, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }





            });
    }

    get routes() {
        return {
            'revengeBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/revenge",
                handler: "revengeBuildHandler",
                help: "Get RevengeOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = RevengeController;
