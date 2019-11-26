const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

class DotOSController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /dot device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, DotOSController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "dotOS",
            projectName: "dotos-downloads",
            website: ""
        }
    }

    get routes() {
        return {
            'dotosBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/dotos",
                handler: "dotosBuildHandler",
                help: "Get dotOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = DotOSController;
