const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var afhFiles = db.collection('afh_files');

class AFHController extends TelegramBaseController {

    launchRequest($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /afh [keywords]", {
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
        afhFiles.aggregate({
            "$match": {
                $or: [{
                    "description": new RegExp(pattern, 'gi')
                }, {
                    "name": new RegExp(pattern, 'gi')
                }]
            }
        }).sort({
            upload_date: -1
        }, async function (err, docs) {
            if (!err && docs && docs.length > 0) {
                var msg = ""
                var t = 0
                for (var i = 0; i < docs.length; i++) {

                    msg += "<a href='https://androidfilehost.com/?fid=" + docs[i].id + "'>" + docs[i].name + "</a>\n\n"
                        t++;

                    if (t > 9)
                        break;
                }

                $.sendMessage(msg, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId,
                    disable_web_page_preview: true
                });
            }
        })
    }

    get routes() {
        return {
            'afhSearchHandler': 'launchRequest',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/afh",
                handler: "afhSearchHandler",
                help: "Search for files on AndroidFileHost"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = AFHController;
