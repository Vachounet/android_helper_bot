const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name)
var motoFirmwares = db.collection('moto')
const request = require('request')

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
            name: {
                $regex: new RegExp(pattern, 'gi')
            },
        }).sort({
            date: -1
        }, function (err, docs) {
            if (docs && docs.length > 0) {
                request.get("https://signedurl-svjhrfxmfa.now.sh/?url=https://rsdsecure-cloud.motorola.com/download/" + docs[0].name,
                    function (error, response, body) {
                        var msg = "*Latests build found* \n"
                        msg += "[" + docs[0].name + "](" + body + ")";
                        $.sendMessage(msg, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });

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

module.exports = MotorolaController;
