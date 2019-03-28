const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const request = require('request')

class GerritController extends TelegramBaseController {

    parseLink($) {

        var matches = $.message.text.match(/\bhttps?:\/\/\S+/gi);

        /// TODO: use regex
        var cid = matches[0].split("/c/")[1].split("+/")[1].split("/")[0];

        var url = matches[0].split("/c/")[0].replace("/#", "");

        request.get(url + "/changes/" + cid + "/detail",
            function (error, response, body) {
                var json = JSON.parse(body.split("'")[1])

                var msg = "*Subject*: `" + json.subject + "`";
                msg += "\n*Project* : `" + json.project + "`";
                msg += "\n*Branch* : `" + json.branch + "`";
                msg += "\n*Status* : `" + json.status + "`";
                msg += "\n*Owner* : `" + json.owner.name + "`";
                if (json.topic) {
                    msg += "\n*Topic* : `" + json.topic + "`";
                }

                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'gerritFilterHandler': 'parseLink',
        }
    }
}

module.exports = GerritController;
