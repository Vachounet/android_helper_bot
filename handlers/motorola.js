const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var motoFirmwares = db.collection('moto')
const request = require('request')
var requestPromise = require("request-promise")

class MotorolaController extends TelegramBaseController {

    getFirmwares($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /moto _keywords_\n*Ex.:* /moto griffin cid50", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var pattern = '^'

        $.command.arguments.forEach(function (element) {
            pattern += '(?=.*' + element + ')'
        })

        pattern += '.*$'

        motoFirmwares.find({
            fileName: {
                $regex: new RegExp(pattern, 'gi')
            },
        }).sort({
            fileName: -1
        }, async function (err, docs) {
            if (docs && docs.length > 0) {
                var msg = "*Latests build found* \n"
                for (var i = 0; i < docs.length; i++) {
                    var signedURL = await getSignedURL("https://signedurl-svjhrfxmfa.now.sh/?url=https://rsdsecure-cloud.motorola.com/download/" + docs[i].fileName)
                    msg += "[" + docs[i].fileName + "](" + signedURL + ") \n"
                    msg += "`Models : " + docs[i].phone.join(" ") + "`\n";
                    msg += "`Carriers : " + docs[i].carrier.join(" ") + "`\n\n";
                    if (i > 1)
                        break;
                }

                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });

            } else {
                $.sendMessage("*No firmwares found*", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        })
    }

    get routes() {
        return {
            'motorolaHandler': 'getFirmwares',
        }
    }
}

async function getSignedURL(url) {

    // Return new promise
    // Do async job
    return await requestPromise.get(url)

}

module.exports = MotorolaController;
