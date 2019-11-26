const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const InputFile = Telegram.InputFile;
var request = require('request');
const config = require('../config')
var parser = require('fast-xml-parser');
const BotUtils = require('../utils')

class CrDroidController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /crdroid device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var keywords = $.command.arguments[0]

        request.get("https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/9.0/update.xml",
            function (error, response, body) {
                if (parser.validate(body)) {
                    var jsonObj = parser.parse(body);

                    var device;
                    for (var i = 0; i < jsonObj.OTA.manufacturer.length; i++) {
                        if (jsonObj.OTA.manufacturer[i][keywords]) {
                            device = jsonObj.OTA.manufacturer[i][keywords];
                            break;
                        }
                    }

                    if (device) {
                        
                            request.get(device.download, {
                                    followRedirect: false
                                },
                                function (error, response, body) {
                                
                                var dlURL = "";
					if (device.download.indexOf("sourceforge") === -1) {
						dlURL = response.headers.location
					} else {
					dlURL = device.download
					}

                                    if (dlURL) {
                                        BotUtils.sendSourceForgeLinks($, dlURL)



                                    } else {

                                        if (fid.indexOf(" ") !== -1) {
                                            fid = fid.split(" ")[0];
                                        }



                                        request.post("https://androidfilehost.com/libs/otf/mirrors.otf.php", {
                                                form: {
                                                    "submit": "submit",
                                                    "action": "getdownloadmirrors",
                                                    "fid": fid

                                                },
                                                headers: {
                                                    "X-Requested-With": "XMLHttpRequest",
                                                    "Host": "androidfilehost.com",
                                                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                                                    "X-MOD-SBB-CTYPE": "xhr",
                                                    "Referer": "https://androidfilehost.com/?fid=" + fid
                                                }
                                            },
                                            function (error, response, body) {
                                                var json = JSON.parse(body);

                                                var links = "";

                                                if (json.STATUS === "1") {
                                                    if (json.MIRRORS && json.MIRRORS.length > 0) {

                                                        for (var i = 0; i < json.MIRRORS.length; i++) {

                                                            links += "[" + json.MIRRORS[i].name + "](" + json.MIRRORS[i].url + ")  "

                                                        }

                                                    } else {
                                                        $.sendMessage("*Mirrors not found *", {
                                                            parse_mode: "markdown",
                                                            reply_to_message_id: $.message.messageId
                                                        });
                                                        return;
                                                    }
                                                }

                                                tg.api.editMessageText("*Mirrors for " + json.MIRRORS[0].url.split("/")[json.MIRRORS[0].url.split("/").length - 1] + " *: \n " + links, {
                                                    parse_mode: "markdown",
                                                    chat_id: msg._chat._id,
                                                    message_id: msg._messageId
                                                });

                                            });
                                    }
                                
                        });

                    } else {
                        $.sendMessage(tg._localization.En.deviceNotFound, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                    }

                }


            }

        );

    }

    static romInfos() {
        return {
            fullName: "crDroidAndroid",
            projectName: "crdroid",
            website: ""
        }
    }

    get routes() {
        return {
            'crDroidBuildHandler': 'triggerCommand',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/crdroid",
                handler: "crDroidBuildHandler",
                help: "Get crDroid build"
            }],
            type: config.commands_type.ROMS
        }
    }
}

module.exports = CrDroidController;
