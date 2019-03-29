const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const InputFile = Telegram.InputFile;
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

        BotUtils.getJSON("https://download.lineageos.org/api/v1/" + keywords + "/nightly/16.0",
            function (builds, err) {

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
