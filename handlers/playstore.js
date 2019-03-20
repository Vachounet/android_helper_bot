const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
const request = require('request')
const JSDOM = require('jsdom')

class PlayStoreController extends TelegramBaseController {

    parseLink($) {

        var matches = $.message.text.match(/\bhttps?:\/\/\S+/gi);

        var packageName = matches[0].split("?id=")[1];

        request.get("https://apkpure.com/search?q=" + packageName, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                }
            },
            function (error, response, body) {
                var dom = new JSDOM.JSDOM(body);

                if (!dom.window.document.querySelector(".search-title a")) {
                    return;
                }

                var newURL = dom.window.document.querySelector(".search-title a").href;

                request.get("https://apkpure.com" + newURL, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                        }
                    },
                    function (error, response, body) {
                        var dom = new JSDOM.JSDOM(body);
                        var lis = dom.window.document.querySelectorAll(".additional li");


                        var apkSize;
                        if (dom.window.document.querySelector(".fsize span")) {
                            apkSize = dom.window.document.querySelector(".fsize span").textContent.split(" ")[0];
                            apkSize = parseInt(apkSize);
                            apkSize = Math.round(apkSize);
                        }

                        var version = lis[1].querySelectorAll("p")[1].textContent;
                        var published_date = lis[2].querySelectorAll("p")[1].textContent;
                        request.get("https://apkpure.com" + newURL + "/download?from=details", {
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                                }
                            },
                            function (error, response, body) {
                                var dom = new JSDOM.JSDOM(body);

                                var apkLink = dom.window.document.querySelector("#download_link").href;

                                request.get(apkLink, {
                                        headers: {
                                            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                                        },
                                        followRedirect: false
                                    },
                                    function (error, response, body) {

                                        if (apkSize && apkSize < 48) {
                                            $.sendDocument({
                                                url: response.headers.location,
                                                filename: packageName + '.apk'
                                            }, {
                                                parse_mode: "markdown",
                                                caption: "Version: *" + version + "* - Released on *" + published_date + "*",
                                                reply_to_message_id: $.message.messageId
                                            })
                                        } else {
                                            $.sendMessage("File too big or size unknown.\n[Direct Link](" + response.headers.location + ")", {
                                                parse_mode: "markdown",
                                                reply_to_message_id: $.message.messageId
                                            });
                                        }
                                    })

                            })

                    })
            })
    }

    get routes() {
        return {
            'playstoreFilterHandler': 'parseLink',
        }
    }
}

module.exports = PlayStoreController;
