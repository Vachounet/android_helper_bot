const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

class BootlegController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /bootleg device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, BootlegController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "Bootleggers",
            projectName: "bootleggersrom",
            website: ""
        }
    }

    get routes() {
        return {
            'bootlegBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/bootleg",
                handler: "bootlegBuildHandler",
                help: "Get Bootleggers builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = BootlegController;
