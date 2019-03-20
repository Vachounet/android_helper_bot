const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');

const JSDOM = require('jsdom');

class GAppsController extends TelegramBaseController {

    getLast($) {

        var commands = $.message.text.replace("/gapps ", "").trim().split(" ");

        var android_version = commands[0];

        if (!android_version || (android_version !== "5.0" && android_version !== "5.1" && android_version !== "6.0" && android_version !== "7.0" && android_version !== "7.1" && android_version !== "8.0" && android_version !== "8.1" & android_version !== "9.0")) {
            android_version = "9.0"
        }

        var type = commands[1];
        if (!type || (type !== "arm" && type !== "arm64")) {
            type = "arm64"
        }

        if (commands[0] && (commands[0] == "arm" || commands[0] == "arm64")) {
            type = commands[0];
        }

        console.log(type)

        request.get("https://api.github.com/repos/opengapps/" + type + "/releases/latest", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {

                var json = JSON.parse(body);

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
