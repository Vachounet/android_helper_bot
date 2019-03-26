const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');

class GSIController extends TelegramBaseController {

    getLast($) {


        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /gsi _type_\nTypes = phh, erfan or descendant", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        switch ($.command.arguments[0]) {
            case "phh":
                this.phhBuilds($)
                break;
            case "erfan":
                this.erfanBuilds($)
                break;
            case "descendant":
                this.descendantBuilds($)
                break;
        }

    }

    erfanBuilds($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /gsi erfan _type_\nTypes = oos, hos, pixel or miui", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var filter = "";
        switch ($.command.arguments[1]) {
            case "miui":
                filter = "MIUI";
                break;
            case "oos":
                filter = "OxygenOS"
                break;
            case "hos":
                filter = "HydrogenOS"
                break;
            case "pixel":
                filter = "Pixel"
                break;
        }
        request.post(
            'https://build.lolinet.com/file/GSI/?', {
                json: {
                    "action": "get",
                    "items": {
                        "href": "/file/GSI/",
                        "what": 1
                    }
                },
                headers: {
                    "content-type": "application/json;charset=utf-8",
                    "Host": "build.lolinet.com",
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                    "Referer": "https://build.lolinet.com/file/GSI/",
                    "Cookie": "PHPSESSID=t7ascuh78voqhea02vp54fjf2s"
                }
            },
            function (error, response, body) {

                var kb = {
                    inline_keyboard: []
                };
                var msg = "🔍 *Files found*: \n";
                console.log(body)
                if (body && body.items && body.items.length > 0) {

                    body.items.sort(function (a, b) {
                        if (new Date(a.time * 1000) < new Date(b.time * 1000))
                            return 1;
                        if (new Date(a.time * 1000) > new Date(b.time * 1000))
                            return -1;
                        return 0;
                    });

                    var foundEntries = 0;
                    for (var i = 0; i < body.items.length; i++) {
                        if (body.items[i].href.indexOf(filter) !== -1) {
                            kb.inline_keyboard.push(
                        [{
                                    text: body.items[i].href.split("/")[body.items[i].href.split("/").length - 1],
                                    url: "https://build.lolinet.com" + body.items[i].href
                        }]);
                            foundEntries = foundEntries + 1;
                            if (foundEntries === 2) {
                                break;
                            }
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

    descendantBuilds($) {
        request.get("https://api.github.com/repos/Descendant/InOps/releases/latest", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {
                var json = JSON.parse(body)

                var msg = "<b>" + json.name + "</b>\n\n"

                var assets = json.assets;

                for (var t = 0; t < assets.length; t++) {
                    msg += "<a href=\"" + assets[t].browser_download_url + "\">" + assets[t].name + "</a> \n"

                }

                $.sendMessage(msg, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId
                });

            });
    }


    phhBuilds($) {
        request.get("https://api.github.com/repos/phhusson/treble_experimentations/releases/latest", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {
                var json = JSON.parse(body)

                var msg = "<b>" + json.name + "</b>\n\n"

                var assets = json.assets;

                for (var t = 0; t < assets.length; t++) {
                    msg += "<a href=\"" + assets[t].browser_download_url + "\">" + assets[t].name + "</a> \n"

                }

                $.sendMessage(msg, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId
                });

            });
    }

    get routes() {
        return {
            'gsiHandler': 'getLast',
        }
    }
}

module.exports = GSIController;
