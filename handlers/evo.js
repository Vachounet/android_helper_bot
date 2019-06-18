const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class EvoController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {
	console.log($.command.command);
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
}



module.exports = EvoController;
