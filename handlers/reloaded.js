const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

const BotUtils = require('../utils')
const config = require('../config')

class ReloadedController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /reloaded device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, ReloadedController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "ReloadedOS",
            projectName: "reloaded-caf",
            website: "https://reloadedos.org/"
        }
    }

    get routes() {
        return {
            'reloadedBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/reloaded",
                handler: "reloadedBuildHandler",
                help: "Get latest ReloadedOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}
module.exports = ReloadedController

