const Telegram = require('telegram-node-bot')
const TelegramBaseInlineQueryController = Telegram.TelegramBaseInlineQueryController;
const request = require("request")

class InlineController extends TelegramBaseInlineQueryController {
    /**
     * @param {Scope} $
     */
    handle($) {

        var articles = [];

        var keyword = $._inlineQuery._query;

        if (!keyword || keyword === "") {
            $.answer(articles, "{}", this.callback)
            return
        }

        request.get("https://9lktu1teg9.algolia.net/1/indexes/prod_SECTIONS?query=" + keyword, {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-Algolia-Application-Id": "9LKTU1TEG9",
                    "X-Algolia-API-Key": "a0f5d13332b8859fd292072ed42e8cd2"
                }
            },
            function (error, response, body) {
                var devices = JSON.parse(body);

                if (devices.hits && devices.hits[0]) {

                    articles.push({
                        type: "article",
                        id: Math.random().toString(36).substring(7),
                        title: "Dedicated forum",
                        input_message_content: {
                            message_text: "<b>Dedicated forum</b> ",
                            parse_mode: "html"
                        },
                    })

                    var cnt = devices.hits.length > 10 ? 10 : devices.hits.length;
                    for (var n = 0; n < cnt; n++) {
                        if (devices.hits[n] && devices.hits[n]._highlightResult && devices.hits[n]._highlightResult.forumTitle.matchLevel === "full") {
                            if (devices.hits[n].url.split("/").length <= 2) {
                                articles.push({
                                    type: "article",
                                    id: Math.random().toString(36).substring(7),
                                    title: devices.hits[n].forumTitle,
                                    input_message_content: {
                                        message_text: devices.hits[n].forumTitle,
                                        parse_mode: "html"
                                    },
                                    url: "https://forum.xda-developers.com" + devices.hits[n].url,
                                    description: devices.hits[n].description
                                })

                            }
                        }
                    }
                }


                request.get("https://9lktu1teg9.algolia.net/1/indexes/prod_THREADS?query=" + keyword + "&typoTolerance=strict&attributesToSnippet=threadTitle:15,firstPostText:55", {
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-Algolia-Application-Id": "9LKTU1TEG9",
                            "X-Algolia-API-Key": "a0f5d13332b8859fd292072ed42e8cd2"
                        }
                    },
                    function (error, response, body) {
                        var json = JSON.parse(body);

                        articles.push({
                            type: "article",
                            id: Math.random().toString(36).substring(7),
                            title: "Thread(s) Found",
                            input_message_content: {
                                message_text: "Thread(s) Found",
                                parse_mode: "html"
                            },
                        })

                        var cnt = json.hits.length;
                        for (var i = 0; i < cnt; i++) {
                            if (json.hits[i] && json.hits[i]._highlightResult && (json.hits[i]._highlightResult.threadTitle.matchLevel === "full" ||
                                    json.hits[i]._highlightResult.firstPostText.matchLevel === "full")) {

                                articles.push({
                                    type: "article",
                                    id: Math.random().toString(36).substring(7),
                                    title: json.hits[i].threadTitle,
                                    input_message_content: {
                                        message_text: json.hits[i].threadTitle,
                                        parse_mode: "html"
                                    },
                                    url: "https://forum.xda-developers.com" + json.hits[i].url,
                                    description: json.hits[i].firstPostText.substring(0, 100)
                                })
                            }
                        }
                        $.answer(articles, "{}", this.callback)
                    });
            })
    }

    callback($) {
        console.log($)
    }
}

module.exports = InlineController;
