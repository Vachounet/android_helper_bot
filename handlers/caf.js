const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
const JSDOM = require('jsdom')
var BotUtils = require("../utils.js")

class CAFController extends TelegramBaseController {

    searchTAG($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /caf keyword\nEx.: /caf msm8953 \n    /caf 7.5", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        request.get("https://wiki.codeaurora.org/xwiki/bin/QAEP/release", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {
                var dom = new JSDOM.JSDOM(body);

                var releases = dom.window.document.querySelectorAll("table tr")
                var release;
                for (var i = 1; i < releases.length; i++) {
                    if (releases[i].textContent.trim().indexOf(keywords) !== -1) {
                        release = {
                            date: releases[i].children[0].textContent.trim(),
                            tag: releases[i].children[1].textContent.trim(),
                            soc: releases[i].children[2].textContent.trim(),
                            manifest: releases[i].children[3].textContent.trim(),
                            version: releases[i].children[4].textContent.trim()
                        }
                        break;
                    }
                }

                if (release) {
                    var msg = "<b>Search Result :</b>\n";
                    msg += "<b>" + release.tag + "</b> released on <b>" + release.date + "</b> for Android <b>" + release.version + "</b>"

                    $.sendMessage(msg, {
                        parse_mode: "html",
                        reply_to_message_id: $.message.messageId
                    });

                } else {
                    var msg = "<b>No result matching your query</b>\n";
                    $.sendMessage(msg, {
                        parse_mode: "html",
                        reply_to_message_id: $.message.messageId
                    });
                }


            });
    }

    get routes() {
        return {
            'cafHandler': 'searchTAG',
        }
    }
}

module.exports = CAFController;
