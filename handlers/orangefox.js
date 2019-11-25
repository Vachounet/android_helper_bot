const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const request = require('request')
const config = require('../config')

class OrangeFoxController extends TelegramBaseController {

    getBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /of device\n*Ex.:* /of raphael", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments[0].trim()

        request.post(
            'https://files.orangefox.tech/OrangeFox-Stable/' + keyword + '/?', {
                json: {
                    "action": "get",
                    "items": {
                        "href": "/OrangeFox-Stable/" + keyword + "/",
                        "what": 1
                    }
                },
                headers: {
                    "content-type": "application/json;charset=utf-8",
                    "Host": "files.orangefox.tech",
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                    "Referer": "https://files.orangefox.tech/OrangeFox-Stable/" + keyword + "/"
                }
            },
            function (error, response, body) {
                var msg = "🔍 <b>OrangeFox build for " + keyword + " </b>: \n";
                if (body && body.items && body.items.length > 0) {

                    body.items.sort(function (a, b) {
                        if (new Date(a.time * 1000) < new Date(b.time * 1000))
                            return 1;
                        if (new Date(a.time * 1000) > new Date(b.time * 1000))
                            return -1;
                        return 0;
                    });
                    var kb = {
                        inline_keyboard: []
                    };
                    var files = [];
                    var allfiles = []
                    for (var i = 0; i < body.items.length; i++) {
                        if (body.items[i].href.indexOf("/" + keyword + "/") !== -1 &&
                            body.items[i].href.indexOf(".zip") !== -1 && !allfiles.includes(body.items[i].href.split("/")[body.items[i].href.split("/").length - 1])) {
                            allfiles.push(body.items[i].href.split("/")[body.items[i].href.split("/").length - 1])
                            msg += "<a href='https://files.orangefox.tech" + body.items[i].href + "'>" + body.items[i].href.split("/")[body.items[i].href.split("/").length - 1] + "</a> \n"
                            if (allfiles.length > 4)
                                break;
                        }
                    }

                    $.sendMessage(msg, {
                        parse_mode: "html",
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
            'orangeFoxHandler': 'getBuild',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/of",
                handler: "orangeFoxHandler",
                help: "OrangeFox recovery"
            }],
            type: config.commands_type.RECOVERY
        }
    }
}

module.exports = OrangeFoxController;
