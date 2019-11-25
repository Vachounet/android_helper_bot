const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require('../config')
const BotUtils = require('../utils')

class PixeldustController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /pixeldust device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, PixeldustController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "PixelDust Project",
            extraSFPath: "ota/{0}",
            projectName: "pixeldustproject",
            website: "https://sourceforge.net/projects/pixeldustproject/"
        }
    }


    get routes() {
        return {
            'pixeldustBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/pdust",
                handler: "pixeldustBuildHandler",
                help: "Get PixelDust builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = PixeldustController;
