const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

class EvoController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /evox device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        if ($.command.command === "evo") {
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, EvoController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "EvolutionX",
            extraSFPath: "{0}",
            projectName: "evolution-x",
            website: ""
        }
    }

    get routes() {
        return {
            'evoBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/evox",
                handler: "evoBuildHandler",
                help: "Get EvolutionX builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = EvoController;
