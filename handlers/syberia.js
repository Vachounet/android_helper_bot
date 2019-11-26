const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

class SyberiaController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /syberia device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, SyberiaController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "SyberiaOS",
            projectName: "syberiaos",
            website: ""
        }
    }

    get routes() {
        return {
            'syberiaBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/syberia",
                handler: "syberiaBuildHandler",
                help: "Get latest SyberiaOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = SyberiaController;