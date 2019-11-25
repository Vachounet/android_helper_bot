const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require('../config')
const BotUtils = require('../utils')

class SuperiorController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /superior device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, SuperiorController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "SuperiorOS",
            extraSFPath: "{0}",
            projectName: "superioros",
            website: ""
        }
    }

    get routes() {
        return {
            'superiorBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/superior",
                handler: "superiorBuildHandler",
                help: "Get SuperiorOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = SuperiorController;
