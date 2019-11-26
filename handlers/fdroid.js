const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
var BotUtils = require("../utils.js")
const config = require('../config')
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var fdroidCol = db.collection('fdroid');

class FDroidController extends TelegramBaseController {

    fdroid($) {

        if ($.command.arguments.length === 0) {

            $.sendMessage("[FDroid APK](https://f-droid.org/FDroid.apk)", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
        } else {

            var pattern = '^'

            $.command.arguments.forEach(function (element) {
                pattern += '(?=.*' + element + ')'
            })

            pattern += '.*$'
            fdroidCol.aggregate({
                "$match": {
                    $or: [{
                        "descrition": new RegExp(pattern, 'gi')
                    }, {
                        "name": new RegExp(pattern, 'gi')
                    }, {
                        "packageName ": new RegExp(pattern, 'gi')
                    }]
                }
            }).sort({
                addedOn: -1
            }, async function (err, docs) {
                if (docs && docs.length > 0) {
                    var msg = ""
                    for (var i = 0; i < docs.length; i++) {
                        msg += "[" + docs[i].name + "](https://mirror.cyberbits.eu/fdroid/repo/" + docs[i].packageName + "_" + docs[i].suggestedVersionCode + ".apk)"
                        if (docs[i].authorName) {
                            msg += " by " + docs[i].authorName
                        }
                        msg += "\n"
                        if (i > 10)
                            break;
                    }

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }
            })
        }
    }

    get routes() {
        return {
            'fdroidHandler': 'fdroid',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/fdroid",
                handler: "fdroidHandler",
                help: "Get latest FDroid apk and search for apps"
            }],
            type: config.commands_type.FDROID
        }
    }
}

module.exports = FDroidController;