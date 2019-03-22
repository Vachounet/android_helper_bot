const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class PixysController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /pixys device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, PixysController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "PixysOS",
            extraSFPath: "pie/{0}",
            projectName: "pixys-os",
            website: ""
        }
    }

    get routes() {
        return {
            'pixysBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = PixysController;
