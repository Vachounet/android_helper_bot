const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
var request = require('request');
const JSDOM = require('jsdom');

class AFHController extends TelegramBaseController {

    parseLink($) {

        var fid = $.message.text.split("fid=")[1].split(" ")[0];

        if (fid.indexOf(" ") !== -1) {
            fid = fid.split(" ")[0];
        }
        BotUtils.sendAFHMirrors(fid, $);

        //        stats.find({}, function (err, docs) {
        //            if (!docs || docs.length === 0) {
        //
        //                stats.save({
        //                    afh: 1,
        //                })
        //            } else {
        //                stats.update({
        //                    _id: docs[0]._id
        //                }, {
        //                    $set: {
        //                        afh: docs[0].afh + 1,
        //                    }
        //                });
        //
        //            }
        //        });


    }

    search($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            return;
        }

        var page = 1;
        this.launchRequest($.command.arguments, page, $, this);
    }

    launchRequest(command, page, $, context) {
        var plop = this;
        var kb = {
            inline_keyboard: []
        };

        request.get("https://androidfilehost.com/?w=search&s=" + command[1] + "&type=files&page=" + page, {
                headers: {
                    "Host": "androidfilehost.com",
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                    "Referer": "https://androidfilehost.com"
                }
            },
            function (error, response, body) {

                var dom = new JSDOM.JSDOM(body);

                var links = dom.window.document.querySelectorAll(".list-group-item .file-name a");

                for (var i = 0; i < links.length; i++) {
                    if (links[i].textContent.toLowerCase().indexOf(command[1].toLowerCase()) !== -1 &&
                        links[i].textContent.toLowerCase().indexOf(command[2].toLowerCase()) !== -1) {
                        kb.inline_keyboard.push(
                                [{
                                text: links[i].textContent,
                                url: "https://androidfilehost.com" + links[i].href
                                }]);
                        break;
                    }
                }

                if (kb.inline_keyboard.length > 0) {
                    $.sendMessage("*AFH Search Result, generating mirrors*:", {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId
                    });
                    var fid = kb.inline_keyboard[0][0].url.split("fid=")[1]

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

                            $.sendMessage("*Mirrors for " + json.MIRRORS[0].url.split("/")[json.MIRRORS[0].url.split("/").length - 1] + " *: \n" + links, {
                                parse_mode: "markdown",
                                reply_to_message_id: $.message.messageId
                            });


                        });


                } else {
                    // TODO: move this on a proper place
                    // Limit to 5 pages for now
                    if (page < 5) {
                        page = page + 1;
                        plop.launchRequest(command, page, $, context)
                    } else {
                        $.sendMessage("*No file found*:", {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                    }
                }

            });
    }

    get routes() {
        return {
            'afhFilterHandler': 'parseLink',
            'afhSearchHandler': 'search',
        }
    }
}

module.exports = AFHController;
