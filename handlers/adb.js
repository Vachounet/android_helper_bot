const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

class ADBController extends TelegramBaseController {

    getSDKTools($) {

        var message = tg._localization.En.sdkPlatformTools;
        message += "[Windows](https://dl.google.com/android/repository/platform-tools-latest-windows.zip) - ";
        message += "[Linux](https://dl.google.com/android/repository/platform-tools-latest-linux.zip) - ";
        message += "[Mac](https://dl.google.com/android/repository/platform-tools-latest-darwin.zip) ";

        $.sendMessage(message, {
            parse_mode: "markdown",
            reply_to_message_id: $.message.messageId
        });
    }

    get routes() {
        return {
            'adbHandler': 'getSDKTools',
            'fastbootHandler': 'getSDKTools',
        }
    }
}



module.exports = ADBController;
