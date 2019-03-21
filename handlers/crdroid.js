const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const InputFile = Telegram.InputFile;
var request = require('request');
var parser = require('fast-xml-parser');
const BotUtils = require('../utils')

class CrDroidController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }

    searchBuild($) {

        var command = $.message.text.replace("/crdroid", "").trim().split(" ");

        if (command.length == 0 || command.length > 1 || command[0] == "") {
            $.sendMessage("Usage: /crdroid device", {
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
                        $.sendMessage("*Last build found : " + device.filename + "* - Generating mirrors", {
                            parse_mode: "markdown",
                            //reply_markup: JSON.stringify(kb),
                            reply_to_message_id: $.message.messageId
                        }).then(function (msg) {
                            request.get(device.download, {
                                    followRedirect: false
                                },
                                function (error, response, body) {
                                    console.log(response.headers.location);

                                    var fid = response.headers.location.split("fid=")[1];
                                    var flid;
                                    if (response.headers.location.indexOf("flid") !== -1) {
                                        flid = response.headers.location.split("flid=")[1];

                                        request.get("https://androidfilehost.com/api/?action=folder&flid=" + flid, {
                                                followRedirect: false,
                                                headers: {
                                                    "X-Requested-With": "XMLHttpRequest",
                                                    "Host": "androidfilehost.com",
                                                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                                                    "X-MOD-SBB-CTYPE": "xhr",
                                                    "Referer": "https://androidfilehost.com/?w=files&flid=" + flid
                                                }
                                            },
                                            function (error, response, body) {
                                                console.log(body);

                                                var json = JSON.parse(body);
                                                var lastFile = json.DATA.files[json.DATA.files.length - 1];
                                                fid = lastFile.url.split("fid=")[1]

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
                                                                    kb.inline_keyboard.push(
                                                                    [{
                                                                            text: json.MIRRORS[i].name,
                                                                            url: json.MIRRORS[i].url
                                                                    }]);

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
                                                            //reply_markup: JSON.stringify(kb),
                                                            message_id: msg._messageId
                                                        });

                                                    });

                                            });



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
                        });

                    }

                }


            }

        );

    }

    get routes() {
        return {
            'crDroidBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = CrDroidController;
