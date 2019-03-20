const Telegram = require('telegram-node-bot')
const TelegramBaseInlineQueryController = Telegram.TelegramBaseInlineQueryController;

class InlineController extends TelegramBaseInlineQueryController {
    /**
     * @param {Scope} $
     */
    handle($) {

    }
}

module.exports = InlineController;
