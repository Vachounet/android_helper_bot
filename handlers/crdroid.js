const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

const BotUtils = require('../utils')
const config = require('../config')

class CrDroidController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /crdroid device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, CrDroidController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "crDroidAndroid",
            projectName: "crdroid",
            website: "https://www.crdroid.net/"
        }
    }

    get routes() {
        return {
            'crDroidBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/crdroid",
                handler: "crDroidBuildHandler",
                help: "Get crDroid build"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = CrDroidController;
