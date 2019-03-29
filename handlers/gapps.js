const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var BotUtils = require("../utils.js")

class GAppsController extends TelegramBaseController {

    getLast($) {

        var type = "arm64",
            android_version = "9.0";

        if (!$.command.arguments[0]) {
            type = "arm64";
            android_version = "9.0";
        } else if (isNaN($.command.arguments[0]) === false) {
            android_version = $.command.arguments[0];
            if ($.command.arguments[1])
                type = $.command.arguments[1]
        } else {
            type = $.command.arguments[0]
            if ($.command.arguments[1])
                android_version = $.command.arguments[1];
        }

        BotUtils.getJSON("https://api.github.com/repos/opengapps/" + type + "/releases/latest",
            function (json, err) {

                var release = json;

                var date = release.published_at.split("T")[0].replace("-", "").replace("-", "")

                var nano_micro = [];
                var pico_mini = [];
                var kb = {
                    inline_keyboard: []
                };
                //https://github.com/opengapps/arm64/releases/download/20180301/open_gapps-arm64-7.1-pico-20180301.zip
                nano_micro.push({
                    text: "Nano",
                    url: "https://github.com/opengapps/" + type + "/releases/download/" + date + "/open_gapps-" + type + "-" + android_version + "-nano-" + date + ".zip"
                });

                nano_micro.push({
                    text: "Micro",
                    url: "https://github.com/opengapps/" + type + "/releases/download/" + date + "/open_gapps-" + type + "-" + android_version + "-micro-" + date + ".zip"
                });
                pico_mini.push({
                    text: "Pico",
                    url: "https://github.com/opengapps/" + type + "/releases/download/" + date + "/open_gapps-" + type + "-" + android_version + "-pico-" + date + ".zip"
                });
                pico_mini.push({
                    text: "Mini",
                    url: "https://github.com/opengapps/" + type + "/releases/download/" + date + "/open_gapps-" + type + "-" + android_version + "-mini-" + date + ".zip"
                });
                kb.inline_keyboard.push(
                    [{
                        text: "Aroma",
                        url: "https://github.com/opengapps/" + type + "/releases/download/" + date + "/open_gapps-" + type + "-" + android_version + "-aroma-" + date + ".zip"
                    }]);

                kb.inline_keyboard.push(nano_micro);
                kb.inline_keyboard.push(pico_mini)

                var msg = "🔍 *Latests " + android_version + " OpenGapps Packages (" + type + ")*: \n";
                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb),
                    reply_to_message_id: $.message.messageId
                });
            })
    }

    get routes() {
        return {
            'gappsHandler': 'getLast',
        }
    }
}

module.exports = GAppsController;
