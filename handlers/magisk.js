const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var BotUtils = require("../utils.js")
var request = require("request")
var requestPromise = require("request-promise")

class MagiskController extends TelegramBaseController {

    getLast($) {

        if ($.command.arguments.length > 0) {

            var pattern = '^'

            $.command.arguments.forEach(function (element) {
                pattern += '(?=.*' + element + ')'
            })

            pattern += '.*$'
            var regex = new RegExp(pattern, 'gi')
            $.sendMessage("Searching for modules...", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            }).then(function (msg) {
                BotUtils.getJSON("https://api.github.com/users/Magisk-Modules-Repo/repos?per_page=100&sort=pushed&page=1",
                    function (json, err) {
                        var filteredResults = json.filter(release => regex.test(release.name) || regex.test(release.description))

                        BotUtils.getJSON("https://api.github.com/users/Magisk-Modules-Repo/repos?per_page=100&sort=pushed&page=2",
                            function (json, err) {
                                var newResults = json.filter(release => regex.test(release.name) || regex.test(release.description))
                                var allResults = filteredResults.concat(newResults)


                                tg.api.editMessageText("Found " + allResults.length + " results. Loading details...", {
                                    parse_mode: "markdown",
                                    chat_id: msg._chat._id,
                                    message_id: msg._messageId
                                });

                                var message = "";
                                allResults.forEach(function (result) {
                                    console.log("https://raw.githubusercontent.com/" + result.full_name + "/module.prop")
                                    request.get("https://raw.githubusercontent.com/" + result.full_name + "/master/module.prop",
                                        function (error, response, body) {

                                            var props = body.split("\n");
                                            var dict = [];

                                            props.forEach(function (prop) {
                                                dict[prop.split("=")[0]] = prop.split("=")[1]
                                            })

                                            message += "[" + dict["name"] + "](https://github.com/" + result.full_name + "/archive/master.zip) " + dict["version"] + "\n";
                                            message += dict["description"] + "\n\n";

                                            tg.api.editMessageText(message, {
                                                parse_mode: "markdown",
                                                chat_id: msg._chat._id,
                                                disable_web_page_preview: true,
                                                message_id: msg._messageId
                                            });

                                        })

                                })

                            })

                    })
            })

            return;
        }


        BotUtils.getJSON("https://api.github.com/repos/topjohnwu/Magisk/releases",
            function (json, err) {

                var magisk = json[0].name.indexOf("Manager") === -1 ? json[0] : json[1];
                var magiskManager = json[0].name.indexOf("Manager") === -1 ? json[1] : json[0];

                var msg = "<b>" + magisk.name + "</b> \n"
                msg += "<a href=\"" + magisk.assets[1].browser_download_url + "\">" + magisk.assets[1].name + "</a> \n"
                msg += "<a href=\"" + magisk.assets[0].browser_download_url + "\">" + magisk.assets[0].name + "</a> \n\n"

                msg += "<b>" + magiskManager.name + "</b> \n"
                msg += "<a href=\"" + magiskManager.assets[0].browser_download_url + "\">" + magiskManager.assets[0].name + "</a> \n\n"

                $.sendMessage(msg, {
                    parse_mode: "html",

                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'magiskHandler': 'getLast',
        }
    }
}

module.exports = MagiskController;
