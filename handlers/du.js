const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const InputFile = Telegram.InputFile;
var request = require('request');

class DUController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var kb = {
            inline_keyboard: []
        };

        var command = $.message.text.replace("/du", "").trim().split(" ");

        if (command.length == 0 || command.length > 1 || command[0] == "") {
            $.sendMessage("Usage: /du device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = "";

        for (var t = 0; t < command.length; t++) {
            if (command[t].trim() !== "")
                keywords += command[t] + " ";
        }
        keywords = keywords.trim();

        request.get("https://download.dirtyunicorns.com/api/files/" + keywords + "/Official",
            function (error, response, body) {
                var json;
                var lastUpdate;
                if (body.indexOf("Slim") == -1) {
                    json = JSON.parse(body);

                    //var mainTable = dom.window.document.querySelector("table");
                    lastUpdate = json[json.length - 1];
                }
                if (lastUpdate) {

                    var link = "https://download.dirtyunicorns.com/api/download/" + keywords + "/Official/" + lastUpdate.filename;

                    kb.inline_keyboard.push(
                        [{
                            text: lastUpdate.filename,
                            url: link
                        }]);
                    // kb.inline_keyboard.push(
                    //             [{
                    //         text: "Changelog",
                    //         url: link + ".html"
                    //             }]);
                }
                request.get("https://download.dirtyunicorns.com/api/files/" + keywords + "/Rc",
                    function (error, response, body) {
                        json = JSON.parse(body);

                        //var mainTable = dom.window.document.querySelector("table");
                        lastUpdate = json[json.length - 1];
                        // if (lastUpdate) {

                        //     link = "https://download.dirtyunicorns.com/api/download/" + keywords + "/Rc/" + lastUpdate.filename;

                        //     kb.inline_keyboard.push(
                        //         [{
                        //             text: lastUpdate.filename,
                        //             url: link
                        //         }]);
                        // }
                        if (kb.inline_keyboard.length > 0) {
                            $.sendMessage("🔍  *Latests DirtyUnicorns build for " + keywords + "*", {
                                parse_mode: "markdown",
                                reply_markup: JSON.stringify(kb),
                                reply_to_message_id: $.message.messageId
                            });
                        } else {
                            $.sendMessage("*Device not found *", {
                                parse_mode: "markdown",
                                reply_to_message_id: $.message.messageId
                            });
                        }

                    });



            }

        );

    }

    get routes() {
        return {
            'duBuildHandler': 'searchBuild',
        }
    }
}



module.exports = DUController;
