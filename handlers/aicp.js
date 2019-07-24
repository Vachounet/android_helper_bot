const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class AICPController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /aicp device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0];

        BotUtils.getJSON("http://updates.aicp-rom.com/update.php?device=" + keywords,
            function (json, err) {
                if (err)
                    return
                if (json.updates && json.updates.length > 0) {
                    var lastUpdate = json.updates[0];
                    var link = lastUpdate.url;

                    kb.inline_keyboard.push(
                                [{
                            text: lastUpdate.name,
                            url: link
                                }]);
                    kb.inline_keyboard.push(
                                [{
                            text: "Changelog",
                            url: link + ".html"
                                }]);

                    $.sendMessage("🔍  *Latest AICP build for " + keywords + "*", {
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


            }

        );

    }

    get routes() {
        return {
            'aicpBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = AICPController;
