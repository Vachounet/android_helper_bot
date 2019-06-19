const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
const JSDOM = require('jsdom')
var BotUtils = require("../utils.js")

class NanodroidController extends TelegramBaseController {

    getLast($) {

        request.get("https://downloads.nanolx.org/NanoDroid/Stable/", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {


                var dom = new JSDOM.JSDOM(body);
                var links = dom.window.document.querySelectorAll("table tr");
                var modules = [];
                var extras = [];
                console.log(links.length)
                for (var i = 1; i < links.length; i++) {
                    if (links[i].textContent.trim().indexOf(".sha") === -1 &&
                        links[i].textContent.trim().indexOf(".asc") === -1) {

                        if (links[i].textContent.trim().indexOf("patcher") !== -1 ||
                            links[i].textContent.trim().indexOf("setup") !== -1 ||
                            links[i].textContent.trim().indexOf("systest") !== -1 ||
                            links[i].textContent.trim().indexOf("uninstaller") !== -1) {
                            extras.push(links[i].querySelector("a"))
                        } else {
                            modules.push(links[i].querySelector("a"))
                        }


                        //var link = links[i].querySelector("a");
                        //console.log(link.href)
                    }
                }

                var msg = "<b>Magisk Modules :</b>\n";
                modules.forEach(function (module) {
                    msg += "<a href='" + module.href + "'>" + module.textContent.trim() + "</a> \n"
                })

                msg += "\n<b>Extras :</b>\n";
                extras.forEach(function (extra) {
                    msg += "<a href='" + extra.href + "'>" + extra.textContent.trim() + "</a> \n"
                })
                $.sendMessage(msg, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'nanodroidHandler': 'getLast',
        }
    }
}

module.exports = NanodroidController;
