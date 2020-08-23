const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

const BotUtils = require('../utils')
const config = require('../config')

class AEXController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /aex device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getJSON('https://api.aospextended.com/builds/' + device + '/q', function (json, err) {
            if (!json) {
                return;
            }
            var msg = 'AospExtended build(s) for ' + device + '\n\n';
            msg += 'Ten : <a href="' + json[0].download_link + '">' + json[0].file_name + '</a>\n'

            BotUtils.getJSON('https://api.aospextended.com/builds/' + device + '/q_gapps', function (json, err) {
                if (json) {
                    msg += 'Ten GApps : <a href="' + json[0].download_link + '">' + json[0].file_name + '</a>'
                }

                $.sendMessage(msg, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId
                });
            })
        })

    }


    get routes() {
        return {
            'aexBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/aex",
                handler: "aexBuildHandler",
                help: "Get AospExtended builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}
module.exports = AEXController

