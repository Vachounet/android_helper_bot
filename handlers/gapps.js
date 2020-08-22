const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var BotUtils = require("../utils.js")
var config = require("../config.js")

class GAppsController extends TelegramBaseController {

    getLast($) {

        var type = "arm64",
            android_version = "10.0";

        if (!$.command.arguments[0]) {
            type = "arm64";
            android_version = "10.0";
        } else if (isNaN($.command.arguments[0]) === false) {
            android_version = $.command.arguments[0];
            if ($.command.arguments[1])
                type = $.command.arguments[1]
        } else {
            type = $.command.arguments[0]
            if ($.command.arguments[1])
                android_version = $.command.arguments[1];
        }

        BotUtils.getJSON("https://api.opengapps.org/list",
        function (json, err) {
                 
                          var msg = "🔍 *Latests " + android_version + " OpenGapps Packages (" + type + ")* - Released on " + json.archs[type].human_date + ": \n";
                          
                          json.archs[type].apis[android_version].variants.forEach(function(element) {
                              msg += "[" + element.name + "](" + element.zip + ")  "
                          });
                          
                          $.sendMessage(msg, {
                              parse_mode: "markdown",
                              reply_to_message_id: $.message.messageId,
                              disable_web_page_preview: true
                          });
        })
    }

    get routes() {
        return {
            'gappsHandler': 'getLast',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/gapps",
                handler: "gappsHandler",
                help: "Get latest OpenGApps packages"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = GAppsController;
