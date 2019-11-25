const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');

const JSDOM = require('jsdom');
const BotUtils = require('../utils')
const config = require('../config')

class RRController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /rr device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0];

        request.get("https://get.resurrectionremix.com/?dir=" + keywords, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {

                var dom = new JSDOM.JSDOM(body);

                var isError = dom.window.document.querySelector(".alert-danger");

                if (isError) {
                    $.sendMessage(tg._localization.En.deviceNotFound, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                    return;
                }

                if (keywords === "gsi") {
                    var kb = {
                        inline_keyboard: []
                    };
                    for (var i = 1; i < 5; i++) {
                        var deviceLI = dom.window.document.querySelectorAll("#directory-listing li")[dom.window.document.querySelectorAll("#directory-listing li").length - i];


                        kb.inline_keyboard.push(
                    [{
                                text: deviceLI.getAttribute("data-name"),
                                url: "https://get.resurrectionremix.com/" + deviceLI.getAttribute("data-href")
                    }]);
                    }
                    var msg = "🔍 *ResurrectionRemix build for " + keywords + ": *\n";
                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId
                    });
                    return;
                }

                var deviceLI = dom.window.document.querySelectorAll("#directory-listing li")[dom.window.document.querySelectorAll("#directory-listing li").length - 1];

                if (deviceLI.getAttribute("data-name").indexOf("md5") !== -1) {
                    deviceLI = dom.window.document.querySelectorAll("#directory-listing li")[dom.window.document.querySelectorAll("#directory-listing li").length - 2];
                }

                var kb = {
                    inline_keyboard: []
                };
                kb.inline_keyboard.push(
                    [{
                        text: deviceLI.getAttribute("data-name"),
                        url: "https://get.resurrectionremix.com/" + deviceLI.getAttribute("data-href")
                    }]);
                var msg = "🔍 *ResurrectionRemix build for " + keywords + ": *\n";
                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb),
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'rrBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/rr",
                handler: "rrBuildHandler",
                help: "Get ResurrectionRemix builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = RRController;
