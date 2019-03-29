const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var request = require('request');
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name)

var followedForums = db.collection('followed_forums');
const JSDOM = require('jsdom');
var BotUtils = require("../utils.js")

var devices;
var forums;

const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

function getDevices() {
    request.get("https://forum.xda-developers.com/clientscript/deviceSearch.js",
        function (error, response, body) {
            devices = body.replace("var deviceSearch=", "").replace("var deviceSearch = ", "").replace(";", "").trim();
            devices = JSON.parse(devices)
        });
}

//startSync();

getDevices();

class XDAController extends TelegramBaseController {

    device($) {

        var kb = {
            inline_keyboard: []
        };

        var keywords = $.message.text.replace("/xda device ", "");

        for (var i = 0; i < devices.devices.length; i++) {
            if (devices.devices[i].searchable.toLowerCase().indexOf(keywords.toLowerCase()) !== -1 ||
                devices.devices[i].deviceName.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
                kb.inline_keyboard.push(
                    [{
                        text: "📱 " + devices.devices[i].searchable,
                        url: "https://forum.xda-developers.com" + devices.devices[i].url
                    }]);
            }
        }

        if (kb.inline_keyboard.length > 0) {
            $.sendMessage("*Device search result *: ", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        } else {
            $.sendMessage("*No device(s) found* ", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        }

    }

    user($) {
        var keywords = $.message.text.replace("/xda user", "").trim();

        var kb = {
            inline_keyboard: []
        };

        BotUtils.getJSON("https://api.xda-developers.com/v3/user/search?username=" + keywords,
            function (users, err) {

                if (!users.results || users.results.length === 0) {
                    $.sendMessage("*User not found* ", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                    return;
                }

                BotUtils.getJSON("https://api.xda-developers.com/v3/user/userinfo?userid=" + users.results[0].userid,
                    function (userinfo, err) {

                        var msg = "👤 *" + userinfo.username + " Infos* \n"

                        msg += "Title: _" + userinfo.usertitle + "_ \n"

                        msg += "Posts: _" + userinfo.posts + "_ \n"

                        msg += "Thanks: _" + userinfo.post_thanks_thanked_times + "_ \n"

                        msg += "Member since: _" + new Date(userinfo.joindate * 1000).toDateString() + "_ \n"

                        if (userinfo.devices && userinfo.devices.length > 0) {
                            msg += "Devices: _"
                            for (var i = 0; i < userinfo.devices.length; i++) {
                                msg += userinfo.devices[i].title + ", "
                            }
                            msg = msg.substring(0, msg.length - 2);
                            msg += "_"
                        }

                        kb.inline_keyboard.push(
                            [{
                                    text: "Profile",
                                    url: "https://forum.xda-developers.com/member.php?u=" + userinfo.userid
                                },
                                {
                                    text: "PM",
                                    url: "https://forum.xda-developers.com/private.php?do=newpm&u=" + userinfo.userid
                                }
                            ]);


                        $.sendMessage(msg, {
                            parse_mode: "markdown",
                            reply_markup: JSON.stringify(kb),
                            reply_to_message_id: $.message.messageId
                        });
                    });


            });
    }

    browse($) {
        var kb = {
            inline_keyboard: []
        };

        var keywords = $.message.text.replace("/xda browse ", "");

        for (var i = 0; i < devices.devices.length; i++) {
            if (devices.devices[i].searchable.toLowerCase().indexOf(keywords.toLowerCase()) !== -1 ||
                devices.devices[i].deviceName.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
                kb.inline_keyboard.push(
                    [{
                        text: "📱 " + devices.devices[i].searchable,
                        callback_data: "xda|fid|" + devices.devices[i].fid
                    }]);
            }
        }

        if (kb.inline_keyboard.length > 0) {
            $.sendMessage("*Device search result *: ", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        } else {
            $.sendMessage("*No device(s) found* ", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        }
    }

    search($) {
        var keywords = $.message.text.replace("/xda forum", "").trim();

        var kb = {
            inline_keyboard: []
        };

        if (!forums) {
            BotUtils.getJSON("https://api.xda-developers.com/v1/forums",
                function (data, err) {
                    forums = data.results;

                    for (var i = 0; i < forums.length; i++) {
                        if (forums[i].title.toLowerCase().indexOf(keywords.toLowerCase()) !== -1 ||
                            forums[i].searchable.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
                            kb.inline_keyboard.push(
                                [{
                                    text: forums[i].title,
                                    url: "https://forum.xda-developers.com" + forums[i].web_uri
                                }]);
                        }

                    }


                    $.sendMessage("*Forums search results*", {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId
                    });



                });
        } else {
            for (var i = 0; i < forums.length; i++) {
                if (forums[i].title.toLowerCase().indexOf(keywords.toLowerCase()) !== -1 ||
                    forums[i].searchable.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
                    kb.inline_keyboard.push(
                        [{
                            text: forums[i].title,
                            url: "https://forum.xda-developers.com" + forums[i].web_uri
                        }]);
                }

            }


            $.sendMessage("*Forums search results*", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        }
    }

    upload($) {
        var postID = $.message.text.split("p=")[1];

        if (postID.indexOf("&") !== -1) {
            postID = postID.split("&")[0]
        }

        BotUtils.getJSON("https://api.xda-developers.com/v3/posts/bypostid?postid=" + postID,
            function (json, err) {

                var postInfos;

                for (var p = 0; p < json.results.length; p++) {
                    if (json.results[p].postid === postID) {
                        postInfos = json.results[p]
                    }
                }


                for (var i = 0; i < postInfos.attachments.length; i++) {
                    $.sendDocument(postInfos.attachments[i].attachment_url, {
                        reply_to_message_id: $.message.messageId
                    });
                }
            });
    }

    news($) {

        var keyword = $.message.text.replace("/xda news").trim().split(" ")[1];

        BotUtils.getJSON("https://www.xda-developers.com/data/portal-data-v2.json",
            function (data, err) {
                var json = data["xda-news"];

                var vendors = data["vendor"];

                var postInfos;

                var msg = "*Latests news from XDA Portal* : \n\n";

                if (!keyword) {
                    for (var p = 0; p < 5; p++) {
                        msg += "📰 [" + json[p].post_title + "](" + json[p].permalink + ")\n\n"
                    }
                } else {
                    for (var t = 0; t < vendors.length; t++) {

                        if (vendors[t].name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {

                            for (var m = 0; m < vendors[t].posts.length; m++) {

                                msg += "📰 [" + vendors[t].posts[m].post_title + "](" + vendors[t].posts[m].permalink + ")\n\n"
                            }
                        }
                    }
                }

                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    disable_web_page_preview: true,
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    threads($) {

        var keyword = $.message.text.replace("/xda thread ", "");

        var msg = ""

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
                    msg += "<b>Dedicated forum</b> : \n";
                    var cnt = devices.hits.length > 10 ? 10 : devices.hits.length;
                    for (var n = 0; n < cnt; n++) {
                        if (devices.hits[n] && devices.hits[n]._highlightResult && devices.hits[n]._highlightResult.forumTitle.matchLevel == "full") {
                            if (devices.hits[n].url.split("/").length <= 2)
                                msg += "🗨️ <a href=\"https://forum.xda-developers.com" + devices.hits[n].url + "\">" + devices.hits[n].forumTitle + "</a> \n"
                        }
                    }
                }

                request.get("https://9lktu1teg9.algolia.net/1/indexes/prod_THREADS?query=" + keyword + "&typoTolerance=strict&attributesToSnippet=deviceName:15,forumUrl:15,threadTitle:15,firstPostText:55", {
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-Algolia-Application-Id": "9LKTU1TEG9",
                            "X-Algolia-API-Key": "a0f5d13332b8859fd292072ed42e8cd2"
                        }
                    },
                    function (error, response, body) {
                        var json = JSON.parse(body);

                        msg += "\n<b>Thread(s) Found</b> : \n";
                        var cnt = 0;
                        for (var i = 0; i < json.hits.length; i++) {

                            if (json.hits[i] && json.hits[i]._highlightResult && (json.hits[i]._highlightResult.threadTitle.matchLevel == "full" ||
                                    json.hits[i]._highlightResult.firstPostText.matchLevel == "full" || (json.hits[i]._highlightResult.forumUrl && json.hits[i]._highlightResult.forumUrl.matchLevel == "full") ||
                                    (json.hits[i]._highlightResult.forumUrl && json.hits[i]._highlightResult.deviceName.matchLevel == "full"))) {
                                msg += "🗨️ <a href=\"https://forum.xda-developers.com" + json.hits[i].url + "\">" + json.hits[i].threadTitle + "</a> \n"
                                cnt++;
                                if (cnt > 4)
                                    break;
                            }
                        }

                        $.sendMessage(msg, {
                            parse_mode: "html",
                            disable_web_page_preview: true,
                            reply_to_message_id: $.message.messageId
                        });
                    });
            })
    }

    follow($) {

        var keyword = $.message.text.replace("/xda follow ", "");

        if (!keyword || keyword === "" || keyword === "/xda follow") {

            $.sendMessage("Usage : /xda follow threadid | add a new thread\n/xda follow rm threadid |  remove a thread\n/xda follow clear | remove all threads/\n/xda follow get | lists followed threads", {
                parse_mode: "markdown",
                disable_web_page_preview: true,
                reply_to_message_id: $.message.messageId
            });
            return;
        }
        if ($.message.chat.type === "private") {
            if (keyword === "clear") {
                followedForums.remove({
                    chatID: {
                        $eq: $.message.chat.id
                    }
                })
                $.sendMessage("All threads removed", {
                    parse_mode: "markdown",
                    disable_web_page_preview: true,
                    reply_to_message_id: $.message.messageId
                });
                return;
            }

            if (keyword.indexOf("rm ") !== -1) {

                var tid = keyword.split("rm ")[1]

                followedForums.find({
                    threadID: {
                        $eq: parseInt(tid),

                    },
                    chatID: {
                        $eq: $.message.chat.id
                    }
                }, function (err, docs) {
                    if (docs && docs.length > 0) {
                        followedForums.remove({
                            _id: {
                                $eq: docs[0]._id
                            }
                        })

                        $.sendMessage("Thread removed", {
                            parse_mode: "markdown",
                            disable_web_page_preview: true,
                            reply_to_message_id: $.message.messageId
                        });
                    }
                })

                return;
            }

            if (keyword === "get") {
                followedForums.find({
                    chatID: {
                        $eq: $.message.chat.id
                    }
                }, function (err, docs) {
                    var msg = "Followed threads:\n";
                    docs.forEach(function (followed) {
                        msg = msg + "- `" + followed.threadID + " - " + followed.threadTitle + "`\n";
                    });

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                })

                return;
            }

            followedForums.find({
                threadID: {
                    $eq: parseInt(keyword)
                }
            }, function (err, docs) {
                if (!docs || docs.length == 0) {

                    BotUtils.getJSON("https://api.xda-developers.com/v3/posts?threadid=" + keyword,
                        function (json, err) {

                            followedForums.save({
                                threadID: parseInt(keyword),
                                chatID: $.message.chat.id,
                                lastUpdate: parseInt(json.thread.lastpost.dateline),
                                threadTitle: json.thread.title
                            })
                            var msg = "`" + json.thread.title + "` added";
                            $.sendMessage(msg, {
                                parse_mode: "markdown",
                                disable_web_page_preview: true,
                                reply_to_message_id: $.message.messageId
                            });



                        })

                } else {
                    BotUtils.getJSON("https://api.xda-developers.com/v3/posts?threadid=" + keyword,
                        function (json, err) {

                            followedForums.update({
                                _id: docs[0]._id
                            }, {
                                $set: {
                                    threadTitle: json.thread.title
                                }
                            }, function () {
                                $.sendMessage("Updated !", {
                                    parse_mode: "markdown",
                                    reply_to_message_id: $.message.messageId
                                });
                            })



                        })
                }
            })


            return;
        }

        $.getChatAdministrators($.message.chat.id).then(data => {
            let msg = "";
            var isAdmin = false;
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].user && data[i].user.id === $.message.from.id)
                        isAdmin = true;
                }
            }
            if (isAdmin || $.message.chat.type === "private") {
                if (keyword === "clear") {
                    followedForums.remove({
                        chatID: {
                            $eq: $.message.chat.id
                        }
                    })
                    $.sendMessage("All threads removed", {
                        parse_mode: "markdown",
                        disable_web_page_preview: true,
                        reply_to_message_id: $.message.messageId
                    });
                    return;
                }

                if (keyword.indexOf("rm ") !== -1) {

                    var tid = keyword.split("rm ")[1]

                    followedForums.find({
                        threadID: {
                            $eq: parseInt(tid),

                        },
                        chatID: {
                            $eq: $.message.chat.id
                        }
                    }, function (err, docs) {
                        if (docs && docs.length > 0) {
                            followedForums.remove({
                                _id: {
                                    $eq: docs[0]._id
                                }
                            })

                            $.sendMessage("Thread removed", {
                                parse_mode: "markdown",
                                disable_web_page_preview: true,
                                reply_to_message_id: $.message.messageId
                            });
                        }
                    })

                    return;
                }

                if (keyword === "get") {
                    followedForums.find({
                        chatID: {
                            $eq: $.message.chat.id
                        }
                    }, function (err, docs) {
                        var msg = "Followed threads:\n";
                        docs.forEach(function (followed) {
                            msg = msg + "- `" + followed.threadID + " - " + followed.threadTitle + "`\n";
                        });

                        $.sendMessage(msg, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                    })

                    return;
                }

                followedForums.find({
                    threadID: {
                        $eq: parseInt(keyword)
                    }
                }, function (err, docs) {
                    if (!docs || docs.length == 0) {

                        BotUtils.getJSON("https://api.xda-developers.com/v3/posts?threadid=" + keyword,
                            function (json, err) {

                                followedForums.save({
                                    threadID: parseInt(keyword),
                                    chatID: $.message.chat.id,
                                    lastUpdate: parseInt(json.thread.lastpost.dateline),
                                    threadTitle: json.thread.title
                                })
                                var msg = "`" + json.thread.title + "` added";
                                $.sendMessage(msg, {
                                    parse_mode: "markdown",
                                    disable_web_page_preview: true,
                                    reply_to_message_id: $.message.messageId
                                });



                            })

                    } else {
                        BotUtils.getJSON("https://api.xda-developers.com/v3/posts?threadid=" + keyword,
                            function (json, err) {

                                followedForums.update({
                                    _id: docs[0]._id
                                }, {
                                    $set: {
                                        threadTitle: json.thread.title
                                    }
                                }, function () {
                                    $.sendMessage("Updated !", {
                                        parse_mode: "markdown",
                                        reply_to_message_id: $.message.messageId
                                    });
                                })



                            })
                    }
                })
            } else {
                $.sendMessage("Only admins are allowed to use this command", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        });

    }

    portal($) {

        var keyword = $.message.text.replace("/xda portal").trim().split(" ")[1];

        BotUtils.getJSON("https://www.xda-developers.com/?json=1",
            function (data, err) {
                var json = data.posts;

                var vendors = data["vendor"];

                var postInfos;

                var msg = "*Latests XDA portal posts* : \n\n";


                for (var p = 0; p < 5; p++) {
                    msg += "📰 [" + entities.decode(json[p].title_plain) + "](" + json[p].url + ") by *" + json[p].author.name + "*\n\n"
                }

                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    disable_web_page_preview: true,
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    devDB($) {

        var keyword = $.message.text.replace("/devdb", "").trim().split(" ");

        var projectType;
        switch (keyword[0]) {
            case "roms":
                projectType = 5
                break;
            case "kernel":
                projectType = 7
                break;
            case "tools":
                projectType = 40
                break;
        }

        if (!projectType)
            return

        var searchTerm = $.message.text.replace("/devdb ", "").replace(keyword[0] + " ", "")

        request.post("https://forum.xda-developers.com/devdb/project/", {
                headers: {
                    "X-Requested-Wtih": "XMLHttpRequest",
                },
                form: {
                    task: 'search',
                    filter__project__projectType_id: projectType, //40-tools, 7-kernel
                    filter__project__device: '',
                    filter__project__order: "dateModified",
                    filter__project__orderType: "desc",
                    filter__project__tags: [],
                    filter__project__productName: encodeURIComponent(searchTerm),
                    //page: 10,
                    securitytoken: "guest"
                }
            },
            function (error, response, body) {
                var dom = new JSDOM.JSDOM(body);
                var trs = dom.window.document.querySelectorAll(".projectResult_row1")
                var msg = "";

                var trLength = trs.length > 9 ? 9 : trs.length;
                for (var i = 0; i < trLength; i++) {
                    var link = "https://forum.xda-developers.com" + trs[i].children[0].querySelector("a").href
                    var title = trs[i].children[0].querySelector("a").textContent.trim();

                    msg += "<a href=\"" + link + "\">" + title + "</a>";
                    msg += " for <i>" + trs[i].children[1].textContent.trim() + "</i> by <b>" + trs[i].children[2].textContent.trim() + "</b>\n\n"
                }

                $.sendMessage(msg, {
                    parse_mode: "html",
                    disable_web_page_preview: true,
                    reply_to_message_id: $.message.messageId
                });
            })
    }

    get routes() {
        return {
            'xdaDeviceHandler': 'device',
            'xdaUserHandler': 'user',
            'xdaBrowseHandler': 'browse',
            'xdaSearchHandler': 'search',
            'xdaUploadHandler': 'upload',
            'xdaNewsHandler': 'news',
            'xdaThreadHandler': 'threads',
            'xdaFollowHandler': 'follow',
            'xdaPortalHandler': 'portal',
            'devDBHandler': 'devDB',
        }
    }
}




module.exports = XDAController;
