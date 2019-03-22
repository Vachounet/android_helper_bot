const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class PotatoController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /posp device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, PotatoController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "POSP",
            extraSFPath: "{0}/weeklies",
            projectName: "posp",
            website: ""
        }
    }

    get routes() {
        return {
            'potatoBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = PotatoController;
