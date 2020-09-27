const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const config = require('../config')

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
            projectName: "pixys-os",
            website: ""
        }
    }

    get routes() {
        return {
            'pixysBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/pixys",
                handler: "pixysBuildHandler",
                help: "Get PixyOS builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



module.exports = PixysController;
