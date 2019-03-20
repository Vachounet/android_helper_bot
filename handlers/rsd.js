const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const request = require('request')
const BotUtils = require('../utils')
const urlparser = require('url');
const util = require('util');

class RSDController extends TelegramBaseController {

    parseLink($) {

        var matches = $.message.text.match(/\bhttps?:\/\/\S+/gi);
        const myURL = urlparser.parse(matches[0]);

        var expiresParam = BotUtils.getUrlParameter(myURL.search, "Expires");

        var expireDate = new Date(parseInt(expiresParam) * 1000);

        var currentDate = new Date();

        if (currentDate > expireDate) {
            var msg = util.format(this._localization.En.rsdLinkExpired, expireDate.toGMTString());

            request.get("https://signedurl-svjhrfxmfa.now.sh/?url=" + matches[0].split("?")[0],
                function (error, response, body) {
                    msg += (body)
                    $.sendMessage(msg, {
                        parse_mode: "html",
                        reply_to_message_id: $.message.messageId
                    });

                });

        } else {
            $.sendMessage(util.format(this._localization.En.rsdLinkWarning, expireDate.toGMTString()), {
                parse_mode: "html",
                reply_to_message_id: $.message.messageId
            });
        }

    }

    get routes() {
        return {
            'rsdFilterHandler': 'parseLink',
        }
    }
}



module.exports = RSDController;
