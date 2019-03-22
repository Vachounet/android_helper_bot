const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');
const BotUtils = require('../utils')

class COSPController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.search)
    }

    search($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /cosp device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments[0]

        request.post(
            'https://mirror.codebucket.de/cosp/' + keyword + '/?', {
                json: {
                    "action": "get",
                    "items": {
                        "href": "/cosp/" + keyword + "/",
                        "what": 1
                    }
                },
                headers: {
                    "content-type": "application/json;charset=utf-8",
                    "Host": "mirror.codebucket.de",
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                    "Referer": "https://mirror.codebucket.de/cosp/",
                    "Cookie": "PHPSESSID=t7ascuh78voqhea02vp54fjf2s"
                }
            },
            function (error, response, body) {

                var msg = "🔍 *COSP Build for " + keyword + " *: \n";

                body.items.sort(function (a, b) {
                    if (new Date(a.time * 1000) < new Date(b.time * 1000))
                        return 1;
                    if (new Date(a.time * 1000) > new Date(b.time * 1000))
                        return -1;
                    return 0;
                });

                if (body && body.items && body.items.length > 0) {
                    for (var i = 0; i < body.items.length; i++) {
                        if (body.items[i].href.indexOf("/" + keyword + "/") !== -1 &&
                            body.items[i].href.indexOf(".zip") !== -1 && body.items[i].href.indexOf(".md5") === -1) {
                            kb.inline_keyboard.push(
                                [{
                                    text: body.items[i].href.split("/")[body.items[i].href.split("/").length - 1],
                                    url: "https://mirror.codebucket.de" + body.items[i].href
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
                    $.sendMessage("No results", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }
            });
    }

    get routes() {
        return {
            'cospBuildHandler': 'triggerCommand',
        }
    }
}

module.exports = COSPController;
