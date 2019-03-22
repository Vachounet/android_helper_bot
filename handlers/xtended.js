const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class XtendedController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /xtended device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, XtendedController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "MSM Extended",
            extraSFPath: "{0}",
            projectName: "xtended",
            website: ""
        }
    }

    get routes() {
        return {
            'xtendedBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = XtendedController;
