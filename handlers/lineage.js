const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const InputFile = Telegram.InputFile;
var request = require('request');
const BotUtils = require('../utils')

class LineageController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /lineage device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        request.get("https://download.lineageos.org/api/v1/" + keywords + "/nightly/16.0",
            function (error, response, body) {

                var builds = JSON.parse(body);

                if (builds.response && builds.response.length > 0) {

                    kb.inline_keyboard.push(
                                [{
                            text: builds.response[builds.response.length - 1].filename,
                            url: builds.response[builds.response.length - 1].url
                                }]);
                    kb.inline_keyboard.push(
                                [{
                            text: "Changelog",
                            url: "https://download.lineageos.org/" + keywords + "/changes"
                                }]);

                    $.sendMessage("*Last build for " + keywords + "*", {
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
            'lineageBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = LineageController;
