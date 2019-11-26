const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var BotUtils = require("../utils.js")
var config = require("../config.js")

class AsusController extends TelegramBaseController {

    getFirmwares($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /asus _keywords_\n*Ex.:* /asus ZS600KL", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var query = $.command.arguments.join(" ");

        BotUtils.getJSON("https://www.asus.com/searchapi/api/v2/Suggestion/" + query + "/global/ProductsAll/10/false/",
            function (json, err) {
                if (json && json.Result.Obj && json.Result.Obj.length > 0) {

                    var device;

                    for (var i = 0; i < json.Result.Obj[0].Data.length; i++) {
                        if (json.Result.Obj[0].Data[i].Url.indexOf("/Phone/") > -1) {
                            device = json.Result.Obj[0].Data[i];
                            break;
                        }
                    }

                    if (device) {
                        BotUtils.getJSON("https://www.asus.com/support/api/product.asmx/GetPDDrivers?cpu=&osid=32&website=global&pdhashedid=" + device.HId,
                            function (json, err) {

                                var result = json.Result
                                var firmwares;

                                if (result && result.Obj && result.Obj.length > 0) {

                                    result.Obj.forEach(function (type) {
                                        if (type.Name === "Firmware") {
                                            firmwares = type;
                                        }
                                    })

                                    if (firmwares && firmwares.Files && firmwares.Files.length > 0) {
                                        var msg = "*Firmware found for " + device.Name + " *\n\n"
                                        var filesLength = firmwares.Files.length > 3 ? 3 : firmwares.Files.length
                                        for (var i = 0; i < filesLength; i++) {
                                            var linkTitle = firmwares.Files[i].DownloadUrl.Global.split("/")[firmwares.Files[i].DownloadUrl.Global.split("/").length - 1]
                                            msg += "[" + linkTitle + "](" + firmwares.Files[i].DownloadUrl.Global + ")\n";
                                            msg += "*" + firmwares.Files[i].FileSize + " - Released date: " + firmwares.Files[i].ReleaseDate + "*\n\n"
                                        }

                                        $.sendMessage(msg, {
                                            parse_mode: "markdown",
                                            reply_to_message_id: $.message.messageId
                                        });

                                    } else {
                                        $.sendMessage("*No firmware found*", {
                                            parse_mode: "markdown",
                                            reply_to_message_id: $.message.messageId
                                        });
                                    }
                                }
                            })
                    } else {
                        $.sendMessage("*Device not found*", {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                    }
                }
            });
    }

    get routes() {
        return {
            'asusHandler': 'getFirmwares',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/asus",
                handler: "asusHandler",
                help: "Search Asus firmwares"
            }],
            type: config.commands_type.FIRMWARE
        }
    }
}

module.exports = AsusController;