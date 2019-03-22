const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

const BotUtils = require('../utils')

class AEXController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /aex device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, AEXController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "AOSPExtended",
            extraSFPath: "{0}/pie",
            projectName: "aospextended-rom",
            website: "https://aospextended.com/"
        }
    }


    get routes() {
        return {
            'aexBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = AEXController;
