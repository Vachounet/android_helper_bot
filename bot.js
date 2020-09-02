'use strict'

const config = require('./config')
const BotUtils = require('./utils')
const Telegram = require('telegram-node-bot')
const TextCommand = Telegram.TextCommand

var request = require('request');
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var followedForums = db.collection('followed_forums');

var botToken = config.token || process.env.BOT_TOKEN

// Export bot as global variable
global.tg = new Telegram.Telegram(botToken, {
    localization: [require('./localization/En.json')]
})

// Default Controllers
var CallbackController = require("./handlers/callbackQuery.js")
var InlineController = require("./handlers/inline.js")
var OtherwiseController = require("./handlers/custom_commands.js")

// Exports all handlers
require('fs').readdirSync(__dirname + '/handlers/').forEach(function (file) {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        try {
            var handler = require('./handlers/' + file)
            var instance = new handler()
            if (instance.config) {
                instance.config.commands.forEach(command => {
                    tg.router.when(
                        new TextCommand(command.command, command.handler, 'Display commands menu'),
                        instance
                    )
                })
            }
        } catch (ex) {
            console.log(ex)
        }
    }
});
// Routes
tg.router.callbackQuery(new CallbackController())
    .inlineQuery(new InlineController())
    .otherwise(new OtherwiseController())

tg.onMaster(() => {

    var syncStarted = false;

    startSync();

    function startSync() {
        setTimeout(function () {
            console.log('Starting refresh last posts')

            followedForums.find({}, function (err, docs) {
                if (docs || docs.length > 0) {

                    for (var i = 0; i < docs.length; i++) {
                        getLastThreads(docs[i], true, onGetLastThreadSucceded);
                    }
                }
            });

            startSync();

        }, Math.floor(Math.random() * (500000 - 200000 + 1) + 200000))
        //}, 300)
    }

    function onGetLastThreadSucceded(threads, forum) {

        if (threads && threads.hits && threads.hits.length > 0) {
            for (var t = 0; t < threads.hits.length; t++) {
                var currentThread = threads.hits[t];

                var postcontent = currentThread.postText.length > 4000 ? currentThread.postText.substring(0, 4000) : currentThread.postText;
                var msg = "🔥 *New Post in* `" + currentThread.postTitle + "` *by* `" + currentThread.postAuthor + "` \n\n";

                msg += "" + BotUtils.convertBBCodeToMarkdown(postcontent) + " \n\n";

                var kb = {
                    inline_keyboard: []
                };

                var arr = []
                arr.push({
                    text: "👁️",
                    url: "https://forum.xda-developers.com/showpost.php?p=" + currentThread.objectID
                });

                arr.push({
                    text: "↪️",
                    url: "https://forum.xda-developers.com/newreply.php?do=newreply&p=" + currentThread.objectID
                });

                arr.push({
                    text: "👤",
                    url: "https://forum.xda-developers.com/member.php?u=" + currentThread.postUserId
                });

                kb.inline_keyboard.push(arr)

                tg.api.sendMessage(forum.chatID, msg, {
                    parse_mode: "markdown",
                    reply_markup: JSON.stringify(kb)
                });

                followedForums.update({
                    _id: forum._id
                }, {
                    $set: {
                        lastUpdate: currentThread.lastPostDate,
                    }
                });
            }
        }

    }

    function getLastThreads(data, data_only, callback) {

        var threadID = data.threadID;
        var filters = encodeURI("filters=threadid=" + threadID + "&numericFilters=[[\"postDate > " + data.lastUpdate + "\"]]")
        request.get("https://9lktu1teg9.algolia.net/1/indexes/prod_POSTS?query=&" + filters, {
            headers: {
                "X-Algolia-Application-Id": "9LKTU1TEG9",
                "X-Algolia-API-Key": "a0f5d13332b8859fd292072ed42e8cd2"
            }
        }, function (error, response, body) {

            var posts;
            try {
                posts = JSON.parse(body);
            } catch (exception) {
                console.log("Unable to parse latests posts from " + threadID)
            }

            if (data_only && posts) {
                callback(posts, data);
            }
        });
    }
})
