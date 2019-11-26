const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

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
            projectName: "xtended",
            website: ""
        }
    }

    get routes() {
        return {
            'xtendedBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/xtended",
                handler: "xtendedBuildHandler",
                help: "Get MSM Xtended builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = XtendedController;