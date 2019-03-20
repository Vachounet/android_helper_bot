const Telegram = require('telegram-node-bot')
const TelegramBaseCallbackQueryController = Telegram.TelegramBaseCallbackQueryController;

class CallbacksController extends TelegramBaseCallbackQueryController {
    /**
     * @param {Scope} $
     */
    handle($) {

    }

}

module.exports = CallbacksController;
