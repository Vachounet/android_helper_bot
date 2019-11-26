const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

class ViperController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /viper device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, ViperController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "ViperOS",
            projectName: "viper-project",
            website: ""
        }
    }

    get routes() {
        return {
            'viperBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/viper",
                handler: "viperBuildHandler",
                help: "Get ViperOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = ViperController;