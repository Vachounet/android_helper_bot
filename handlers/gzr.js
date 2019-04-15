const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
var request = require('request');
const JSDOM = require('jsdom');

class GzrController extends TelegramBaseController {

    triggerValidusCommand($) {
        BotUtils.getRomFilter($, this.searchValidusBuild)
    }

    triggerGzospCommand($) {
        BotUtils.getRomFilter($, this.searchGzospBuild)
    }

    searchGzospBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /gzosp device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        var plop = this;
        var kb = {
            inline_keyboard: []
        };

        request.get("https://androidfilehost.com/?w=search&s=Gzosp-" + keywords + "&type=files&page=1", {
                headers: {
                    "Host": "androidfilehost.com",
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                    "Referer": "https://androidfilehost.com"
                }
            },
            function (error, response, body) {

                var dom = new JSDOM.JSDOM(body);

                var links = dom.window.document.querySelectorAll(".list-group-item .file-name a");

                for (var i = 0; i < links.length; i++) {
                    if (links[i].textContent.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
                        kb.inline_keyboard.push(
                                [{
                                text: links[i].textContent,
                                url: "https://androidfilehost.com" + links[i].href
                                }]);
                        break;
                    }
                }

                if (kb.inline_keyboard.length > 0) {

                    var fid = kb.inline_keyboard[0][0].url.split("fid=")[1]

                    BotUtils.sendAFHMirrors(fid, $);

                } else {
                    $.sendMessage("*No file found for " + keywords + " *", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }

            });
    }

    searchValidusBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /validus device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        var plop = this;
        var kb = {
            inline_keyboard: []
        };

        request.get("https://androidfilehost.com/?w=search&s=Validus-" + keywords + "&type=files&page=1", {
                headers: {
                    "Host": "androidfilehost.com",
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                    "Referer": "https://androidfilehost.com"
                }
            },
            function (error, response, body) {

                var dom = new JSDOM.JSDOM(body);

                var links = dom.window.document.querySelectorAll(".list-group-item .file-name a");

                for (var i = 0; i < links.length; i++) {
                    if (links[i].textContent.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
                        kb.inline_keyboard.push(
                                [{
                                text: links[i].textContent,
                                url: "https://androidfilehost.com" + links[i].href
                                }]);
                        break;
                    }
                }

                if (kb.inline_keyboard.length > 0) {

                    var fid = kb.inline_keyboard[0][0].url.split("fid=")[1]

                    BotUtils.sendAFHMirrors(fid, $);

                } else {
                    $.sendMessage("*No file found for " + keywords + " *", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }

            });
    }

    get routes() {
        return {
            'validusBuildHandler': 'triggerValidusCommand',
            'gzospBuildHandler': 'triggerGzospCommand',
        }
    }
}



module.exports = GzrController;
