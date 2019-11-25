const Telegram = require('telegram-node-bot')
const TelegramBaseCallbackQueryController = Telegram.TelegramBaseCallbackQueryController;
const BotUtils = require("../utils.js")
const StartController = require("./start.js")
var exec = require('child_process').exec;

class CallbacksController extends TelegramBaseCallbackQueryController {
    /**
     * @param {Scope} $
     */
    handle($) {
        if ($.update.callbackQuery.data) {
            var params = $.update.callbackQuery.data.split("|");
            tg.api.answerCallbackQuery($.update.callbackQuery.id);
            switch (params[0]) {
                case "xda":
                    this.handleXDACallback($, params)
                    break;
                case "main_menu":
                    //this.handleHelp($, params)
                    new StartController().help($, true);
                    break;
                case "mega":
                    this.handleMega($, params)
                    break;
            }
        }
    }

    handleMega($, params) {

        exec(__dirname + "/../megadown 'https://mega.nz/#" + params[1] + "'", function callback(error, stdout, stderr) {
            var json = JSON.parse(stdout);
            var kb = {
                inline_keyboard: []
            };

            tg.api.sendMessage($.update.callbackQuery.from.id, "*Download Link* :\n[" + json.file_name + "](" + json.url + ")", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb)
            });

        });
    }

    handleXDACallback($, params) {
        switch (params[1]) {
            case "fid":
                var fid = params[2];
                $.setUserSession('threadID', fid)
                BotUtils.getJSON("https://api.xda-developers.com/v3/forums/children?forumid=" + fid,
                    function (data, err) {
                        if (err)
                            return;

                        var childForums = data.results;
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
                $.setUserSession('threadID', fid)
                BotUtils.getJSON("https://api.xda-developers.com/v3/threads?forumid=" + fid,
                    function (data, error) {

                        if (error)
                            return

                        var threads = data.results;
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
                        //                        kb.inline_keyboard.push(
                        //                            [{
                        //                                text: "Back",
                        //                                callback_data: $.update.callbackQuery.data
                        //                            }]);
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

                BotUtils.getJSON("https://api.xda-developers.com/v3/posts?threadid=" + threadid + "&page=" + page,
                    function (posts, err) {

                        if (err)
                            return

                        $.getUserSession('threadID').then(data => {
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
                                        callback_data: "xda|threads|" + data
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
                        })

                    });
        }
    }
}

module.exports = CallbacksController;
