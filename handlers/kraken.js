const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

 const BotUtils = require('../utils')
 const config = require('../config')

 class KrakenController extends TelegramBaseController {

     triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

     searchBuild($) {

         if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /kraken device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

         var device = $.command.arguments[0];

         BotUtils.getSourceForgeBuilds($, KrakenController.romInfos(), device);

     }

     static romInfos() {
        return {
            fullName: "Kraken Open Tentacles Project",
            extraSFPath: "{0}",
            projectName: "krakenproject",
            website: "https://sourceforge.net/projects/krakenproject/"
        }
    }


     get routes() {
        return {
            'krakenBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/kraken",
                handler: "krakenBuildHandler",
                help: "Get Kraken Open Tentacles Project builds"
            }],
            type: config.commands_type.ROMS
        }
    }
}



 module.exports = KrakenController;
