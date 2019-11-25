const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');

const JSDOM = require('jsdom')
var BotUtils = require("../utils.js")
const config = require('../config')

class TWRPController extends TelegramBaseController {

    search($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /twrp device name", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keyword = $.command.arguments.join(" ");


        BotUtils.getJSON("https://twrp.me/search.json", function (json, err) {

            if (err) {
                $.sendMessage(tg._localization.En.deviceNotFound, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
                return
            }

            var msg = "";
            for (var i = 0; i < json.length; i++) {
                if (json[i].title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                    var codeName = json[i].title.split("(")[1].split(")")[0]

                    request.get("https://dl.twrp.me/" + codeName + "/",
                        function (error, response, body) {
                            var dom = new JSDOM.JSDOM(body);
                            var lastVersion = dom.window.document.querySelector("table a");

                            if (lastVersion) {
                                var fileSize = dom.window.document.querySelectorAll("table span")[0].textContent;
                                var rlzDate = dom.window.document.querySelectorAll("table span")[1].textContent;

                                msg += "[" + lastVersion.textContent + "](https://dl.twrp.me/" + codeName + "/" + lastVersion.textContent + ")"
                                msg += "\n" + fileSize.trim()
                                msg += "\n" + rlzDate.trim()
                                $.sendMessage("🔍 *TWRP Search Result(s):*\n\n" + msg, {
                                    parse_mode: "markdown",
                                    reply_to_message_id: $.message.messageId
                                });

                            } else {
                                $.sendMessage(tg._localization.En.deviceNotFound, {
                                    parse_mode: "markdown",
                                    reply_to_message_id: $.message.messageId
                                });
                            }
                        })
                    break;
                }
            }
        })
    }

    get routes() {
        return {
            'twrpHandler': 'search',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/twrp",
                handler: "twrpHandler",
                help: "TWRP recovery"
            }],
            type: config.commands_type.RECOVERY
        }
    }
}



module.exports = TWRPController;
