const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
var BotUtils = require("../utils")
const config = require('../config')

class AptoideController extends TelegramBaseController {
    search($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /aptoide [keywords]", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments.join(" ").trim()
        BotUtils.getJSON('https://ws75.aptoide.com/api/7/listSearchApps?query=' + keywords + '&trusted=true&mature=false&use_qa_index=true', function (json, err) {
            if (json.datalist && json.datalist.list.length > 0) {
                var msg = "";
                json.datalist.list.slice(0, 10).map(app => {
                    msg += "<a href='" + app.file.path + "'>" + app.name + " v" + app.file.vername + "</a>\n"
                    msg += "Last update : " + app.updated + "\n\n"
                })
                $.sendMessage(msg, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId
                });
            } else {
                $.sendMessage("No result matching your query", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        })
    }

    get routes() {
        return {
            'aptoideHandler': 'search',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/aptoide",
                handler: "aptoideHandler",
                help: "Search for apps on aptoide.com"
            }],
            type: config.commands_type.FDROID
        }
    }
}

module.exports = AptoideController;