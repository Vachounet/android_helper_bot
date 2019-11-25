const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');
const BotUtils = require('../utils')
var config = require("../config.js")

class OmniController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /omni device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments[0]

        request.post(
            'https://dl.omnirom.org/' + keyword + '/', {
                form: {
                    "action": "get",
                    "items": true,
                    "itemsHref": "/" + keyword + "/",
                    "itemsWhat": 1
                },
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "content-type": "application/json; charset=UTF-8",
                    "Host": "dl.omnirom.org",
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                    "Referer": "https://dl.omnirom.org/" + keyword + "/",
                    "Cookie": "PHPSESSID=i6qd18q4pg5h14hr9o93s5k1a3",
                    "X-Requested-With": "XMLHttpRequest"
                }
            },
            function (error, response, body) {
                var msg = "🔍 *OmniROM Build for " + keyword + " *: \n";

                var json = JSON.parse(body);

                if (json && json.items && json.items.length > 0) {
                    json.items.sort(function (a, b) {
                        if (new Date(a.time * 1000) < new Date(b.time * 1000))
                            return 1;
                        if (new Date(a.time * 1000) > new Date(b.time * 1000))
                            return -1;
                        return 0;
                    });
                    for (var i = 0; i < json.items.length; i++) {
                        if (json.items[i].absHref.indexOf("/" + keyword + "/") !== -1 &&
                            json.items[i].absHref.indexOf(".zip") !== -1 && json.items[i].absHref.indexOf(".md5") === -1) {
                            kb.inline_keyboard.push(
                        [{
                                    text: json.items[i].absHref.split("/")[json.items[i].absHref.split("/").length - 1],
                                    url: "https://dl.omnirom.org" + json.items[i].absHref
                        }]);
                            break;
                        }
                    }
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
            'omniBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/omni",
                handler: "omniBuildHandler",
                help:"Get OmniROM builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = OmniController;
