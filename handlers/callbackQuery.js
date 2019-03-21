const Telegram = require('telegram-node-bot')
const TelegramBaseCallbackQueryController = Telegram.TelegramBaseCallbackQueryController;

const BotUtils = require("../utils.js")
var request = require('request');

class CallbacksController extends TelegramBaseCallbackQueryController {
    /**
     * @param {Scope} $
     */
    handle($) {
        if ($.data) {
            var params = $.data.split("|");

            switch (params[0]) {
                case "xda":
                    this.handleXDACallback($, params)
                    break;
            }
        }
    }

    handleXDACallback($, params) {
        switch (params[1]) {
            case "fid":
                var fid = params[2];

                request.get("https://api.xda-developers.com/v3/forums/children?forumid=" + fid,
                    function (error, response, body) {
                        var childForums = JSON.parse(body).results;
                        var kb = {
                            inline_keyboard: []
                        };


                        for (var i = 0; i < childForums.length; i++) {
                            kb.inline_keyboard.push(
                                [{
                                    text: childForums[i].title,
                                    callback_data: "xda|threads|" + childForums[i].forumid
                                }]);
                        }

                        tg.api.editMessageText("*Choose a subforum*", {
                            parse_mode: "markdown",
                            chat_id: $.message.chat.id,
                            reply_markup: JSON.stringify(kb),
                            message_id: $.message.messageId
                        });

                    });
                break;
            case "threads":
                var fid = params[2];

                request.get("https://api.xda-developers.com/v3/threads?forumid=" + fid,
                    function (error, response, body) {
                        var threads = JSON.parse(body).results;
                        var kb = {
                            inline_keyboard: []
                        };

                        var count = threads.length > 10 ? 10 : threads.length
                        for (var i = 0; i < count; i++) {
                            kb.inline_keyboard.push(
                                [{
                                    text: threads[i].title,
                                    callback_data: "xda|posts|" + threads[i].threadid + "|" + threads[i].total_posts
                                }]);
                        }
                        kb.inline_keyboard.push(
                            [{
                                text: "Back",
                                callback_data: $.data
                            }]);
                        tg.api.editMessageText("*Choose a thread*", {
                            parse_mode: "markdown",
                            chat_id: $.message.chat.id,
                            reply_markup: JSON.stringify(kb),
                            message_id: $.message.messageId
                        });

                    });
                break;
            case "posts":
                var threadid = params[2];

                var total_posts = parseInt(params[3]);


                var current_post = params[4] ? parseInt(params[4]) : parseInt(params[3]);

                var page = Math.ceil(current_post / 10);

                var postIndex = params[4] ? params[4].substr(params[4].length - 1) : params[3].substr(params[3].length - 1)
                if (postIndex === "0") {
                    postIndex = "10"
                    page = page - 1
                }

                request.get("https://api.xda-developers.com/v3/posts?threadid=" + threadid + "&page=" + page,
                    function (error, response, body) {
                        var posts = JSON.parse(body);
                        var kb = {
                            inline_keyboard: []
                        };

                        var currentPost = posts.results[parseInt(postIndex) - 1]



                        kb.inline_keyboard.push(
                            [{
                                    text: "<",
                                    callback_data: "xda|posts|" + posts.thread.threadid + "|" + total_posts + "|" + (current_post - 1)
                                },
                                {
                                    text: "Back",
                                    callback_data: $.data
                                },
                                {
                                    text: ">",
                                    callback_data: "xda|posts|" + posts.thread.threadid + "|" + total_posts + "|" + (current_post + 1)
                                }
                            ]);
                        tg.api.editMessageText("Post from *" + currentPost.username + "*  \n\n " + BotUtils.convertBBCodeToMarkdown(currentPost.pagetext) + "", {
                            parse_mode: "markdown",
                            chat_id: $.message.chat.id,
                            reply_markup: JSON.stringify(kb),
                            message_id: $.message.messageId
                        });

                    });
        }
    }
}

module.exports = CallbacksController;
