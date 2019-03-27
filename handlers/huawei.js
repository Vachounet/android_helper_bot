const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name)
var motoFirmwares = db.collection('moto')
const request = require('request')
var requestPromise = require('request-promise');
var parser = require('fast-xml-parser');
var BotUtils = require("../utils.js")

class HuaweiController extends TelegramBaseController {

    getFirmwares($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /huawei _keywords_\n*Ex.:* /huawei berkeley l04", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        request.get("https://pro-teammt.ru/projects/hwff/models.list",
            function (error, response, body) {

                var lines = body.split('\n');
                var pattern = '^'

                $.command.arguments.forEach(function (element) {
                    pattern += '(?=.*' + element + ')'
                })

                pattern += '.*$'

                var deviceMatch = new RegExp(pattern, 'gmi')
                var device;
                for (let lineIndex in lines) {
                    if (deviceMatch.test(lines[lineIndex])) {
                        device = lines[lineIndex];
                        break;
                    }
                }
                if (device) {
                    request.get("https://pro-teammt.ru/projects/hwff/info/ff_get_data_android.php?model_json=" + device,
                        async function (error, response, body) {
                            var json = JSON.parse(body)

                            if (json.firmwares && json.firmwares.length > 0) {
                                var msg = "*Firmware found for " + device + " *\n\n"
                                var fullFound = 0;
                                for (var i = 0; i < json.firmwares.length; i++) {

                                    if (json.firmwares[i].type === "FullOTA-MF") {

                                        var filesList = await getFilesList(json.firmwares[i].filelist_link)

                                        var lastElem = json.firmwares[i].filelist_link.split("/").pop()

                                        var jsonObj = parser.parse(filesList);

                                        msg += "*" + json.firmwares[i].firmware + "*\n";

                                        jsonObj.root.files.file.forEach(function (file) {
                                            if (file.spath.indexOf("update") !== -1) {
                                                msg += "[" + file.spath + "](" + json.firmwares[i].filelist_link.replace(lastElem, file.spath) + ") - " + BotUtils.humanFileSize(file.size) + " \n";
                                            }
                                        })
                                        msg += "\n"

                                        fullFound++;
                                        if (fullFound > 2)
                                            break;
                                    }
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
                        })
                } else {
                    $.sendMessage("*Device not found*", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                }
            })
    }

    get routes() {
        return {
            'huaweiHandler': 'getFirmwares',
        }
    }
}

async function getFilesList(url) {

    // Return new promise
    // Do async job
    return await requestPromise.get(url)

}

module.exports = HuaweiController;
