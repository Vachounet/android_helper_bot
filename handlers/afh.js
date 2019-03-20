const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const request = require('request')
const BotUtils = require('../utils')
const urlparser = require('url');
const util = require('util');

class AFHController extends TelegramBaseController {

    parseLink($) {

        var fid = $.message.text.split("fid=")[1].split(" ")[0];

        if (fid.indexOf(" ") !== -1) {
            fid = fid.split(" ")[0];
        }
        var kb = {
            inline_keyboard: []
        };

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
                        $.sendMessage(tg._localization.En.afhMirrorsNotFound, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                        return;
                    }
                }
                let msg = util.format(tg._localization.En.afhMirrors, json.MIRRORS[0].url.split("/")[json.MIRRORS[0].url.split("/").length - 1]);
                $.sendMessage(msg + links, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    get routes() {
        return {
            'afhFilterHandler': 'parseLink',
        }
    }
}

module.exports = AFHController;
