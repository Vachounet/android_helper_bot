const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
const BotUtils = require('../utils')
const config = require('../config')
class DUController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /du device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        request.get("https://download.dirtyunicorns.com/api/files/" + keywords + "/Official",
            function (error, response, body) {
                var json;
                var lastUpdate;
                if (body.indexOf("Slim") === -1) {
                    json = JSON.parse(body);

                    lastUpdate = json[json.length - 1];
                }
                if (lastUpdate) {

                    var link = "https://download.dirtyunicorns.com/api/download/" + keywords + "/Official/" + lastUpdate.filename;

                    kb.inline_keyboard.push(
                        [{
                            text: lastUpdate.filename,
                            url: link
                        }]);

                    request.get("https://download.dirtyunicorns.com/api/files/" + keywords + "/Rc",
                        function (error, response, body) {
                            json = JSON.parse(body);

                            lastUpdate = json[json.length - 1];
                            if (kb.inline_keyboard.length > 0) {
                                $.sendMessage("🔍  *Latests DirtyUnicorns build for " + keywords + "*", {
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
            'duBuildHandler': 'triggerCommand',
        }
    }

    // get config() {
    //     return {
    //         commands: [{
    //             command: "/du",
    //             handler: "duBuildHandler",
    //             help: "Get DirtyUnicorns builds"
    //         }],
    //         type: config.commands_type.ROMS
    //     }
    // }
}

module.exports = DUController;
