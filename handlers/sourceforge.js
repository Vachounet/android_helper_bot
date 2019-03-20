const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const request = require('request')

class SourceForgeController extends TelegramBaseController {

    parseLink($) {

        BotUtils.sendSourceForgeLinks($)

        //            stats.find({}, function (err, docs) {
        //                if (!docs || docs.length === 0 || !docs[0].sf) {
        //
        //                    stats.update({
        //                        _id: docs[0]._id
        //                    }, {
        //                        $set: {
        //                            sf: 1,
        //                        }
        //                    });
        //                } else {
        //                    stats.update({
        //                        _id: docs[0]._id
        //                    }, {
        //                        $set: {
        //                            sf: docs[0].sf + 1,
        //                        }
        //                    });
        //
        //                }
        //            });
        //
        //        $.sendMessage("*Direct Downloads* : \n" + links, {
        //            parse_mode: "markdown",
        //            //reply_markup: JSON.stringify(kb),
        //            reply_to_message_id: $.message.messageId
        //        });
    }

    get routes() {
        return {
            'sfFilterHandler': 'parseLink',
        }
    }
}

module.exports = SourceForgeController;
