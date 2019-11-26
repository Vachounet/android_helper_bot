const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

class ColtController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /colt device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, ColtController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "ColtOS",
            projectName: "coltos",
            website: ""
        }
    }

    get routes() {
        return {
            'coltBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/colt",
                handler: "coltBuildHandler",
                help: "Get ColtOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = ColtController;
