const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

const BotUtils = require('../utils')

class CandyController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /candy device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, CandyController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "CandyROM",
            extraSFPath: "Official/ten/{0}",
            projectName: "candyroms",
            website: "https://sourceforge.net/projects/candyroms/"
        }
    }


    get routes() {
        return {
            'candyBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = CandyController;
