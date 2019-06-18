const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

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
            extraSFPath: "{0}",
            projectName: "coltos",
            website: ""
        }
    }

    get routes() {
        return {
            'coltBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = ColtController;
