const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
var parser = require('fast-xml-parser');
var BotUtils = require("../utils.js")
const config = require('../config')

class MicroGController extends TelegramBaseController {

    getLast($) {

        request.get("https://microg.org/fdroid/repo/index.xml", {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {

                var jsonObj = parser.parse(body);

                var msg = "<b>Latests packages</b>\n";
                for (var i = 0; i < jsonObj.fdroid.application.length; i++) {
                    var pack = jsonObj.fdroid.application[i].package[0];

                    if (pack && pack.apkname) {
                        msg += "<a href=\"https://microg.org/fdroid/repo/" + pack.apkname + "\">" + jsonObj.fdroid.application[i].name + " (" + pack.version + ")</a> \n"
                    } else {
                        msg += "<a href=\"https://microg.org/fdroid/repo/" + jsonObj.fdroid.application[i].package.apkname + "\">" + jsonObj.fdroid.application[i].name + " (" + jsonObj.fdroid.application[i].package.version + ") </a> \n"
                    }
                }

                BotUtils.getJSON("https://api.github.com/repos/microg/android_packages_apps_UnifiedNlp/releases/latest",
                    function (json, err) {

                        msg += "\n<b>UnifiedNlp (" + json.name + ")</b>\n"

                        var assets = json.assets;

                        for (var t = 0; t < assets.length; t++) {
                            msg += "<a href=\"" + assets[t].browser_download_url + "\">" + assets[t].name + "</a> \n"

                        }

                        $.sendMessage(msg, {
                            parse_mode: "html",

                            reply_to_message_id: $.message.messageId
                        });

                    });
            });
    }

    get routes() {
        return {
            'microgHandler': 'getLast',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/microg",
                handler: "syberiaBuildHandler",
                help: "Get latest microG packages"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = MicroGController;
