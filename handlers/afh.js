const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class AFHController extends TelegramBaseController {

    parseLink($) {

        var fid = $.message.text.split("fid=")[1].split(" ")[0];

        if (fid.indexOf(" ") !== -1) {
            fid = fid.split(" ")[0];
        }
        BotUtils.sendAFHMirrors(fid, $);

        //        stats.find({}, function (err, docs) {
        //            if (!docs || docs.length === 0) {
        //
        //                stats.save({
        //                    afh: 1,
        //                })
        //            } else {
        //                stats.update({
        //                    _id: docs[0]._id
        //                }, {
        //                    $set: {
        //                        afh: docs[0].afh + 1,
        //                    }
        //                });
        //
        //            }
        //        });


    }

    get routes() {
        return {
            'afhFilterHandler': 'parseLink',
        }
    }
}

module.exports = AFHController;
