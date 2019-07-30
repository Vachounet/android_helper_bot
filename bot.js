'use strict'

const config = require('./config')
const BotUtils = require('./utils')
const Telegram = require('telegram-node-bot')
const TextCommand = Telegram.TextCommand
const {
    Client
} = require('tdl')
const {
    TDLib
} = require('tdl-tdlib-ffi')

const tdlib = require("./tdlib")
const tdLibLCient = new tdlib();

if (config.enableTdlib)
    tdLibLCient.init();

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
        var name = file.replace('.js', '');

        exports[name] = require('./handlers/' + file);
    }
});
// Routes
tg.router

    .when(
        new TextCommand('/start', 'startHandler', 'Display commands menu'),
        new exports["start"]()
    )
    .when(
        new TextCommand('/help', 'helpHandler', 'Display commands menu'),
        new exports["start"]()
    )


    .when(
        new TextCommand('/ddump', 'dumpHandler', ''),
        new exports["dump"]()
    )

    .when(
        new TextCommand('/filterrom', 'filterRomHandler', ''),
        new exports["filterrom"]()
    )

    .when(
        new TextCommand('/adb', 'adbHandler', 'Get latest SDK Platform Tools links'),
        new exports["adb"]()
    )

    .when(
        new TextCommand('/aex', 'aexBuildHandler', 'Search for latests AOSPExtended builds'),
        new exports["aex"]()
    )

    .when(
        new TextCommand('/fastboot', 'adbHandler', 'Get latest SDK Platform Tools links'),
        new exports["adb"]()
    )

    .when(
        new TextCommand('/afh search', 'afhSearchHandler', 'Search for files on AndroidFileHost'),
        new exports["afh"]()
    )

    .when(
        new TextCommand('/aicp', 'aicpBuildHandler', 'Search for latests AICP builds'),
        new exports["aicp"]()
    )

    .when(
        new TextCommand('/aosip', 'aosipBuildHandler', 'Search for latests AOSiP builds'),
        new exports["aosip"]()
    )

    .when(
        new TextCommand('/am search', 'searchHandler', 'Search for APKs on APKMirror'),
        new exports["apkmirror"]()
    )

    .when(
        new TextCommand('/arrow', 'arrowBuildHandler', 'Search for latests ArrowOS builds'),
        new exports["arrow"]()
    )

    .when(
        new TextCommand('/bootleg', 'bootlegBuildHandler', 'Search for latests Bootleggers builds'),
        new exports["bootleg"]()
    )

    .when(
        new TextCommand('/carbon', 'carbonBuildHandler', 'Search for latests CarbonROM builds'),
        new exports["carbon"]()
    )

    .when(
        new TextCommand('/cosp', 'cospBuildHandler', 'Search for latests COSP builds'),
        new exports["cosp"]()
    )

    .when(
        new TextCommand('/crdroid', 'crDroidBuildHandler', 'Search for latests crDroid builds'),
        new exports["crdroid"]()
    )

    .when(
        new TextCommand('/dot', 'dotosBuildHandler', 'Search for latests DotOS builds'),
        new exports["dotos"]()
    )

    .when(
        new TextCommand('/du', 'duBuildHandler', 'Search for latests DirtyUnicorns builds'),
        new exports["du"]()
    )

    .when(
        new TextCommand('/gapps', 'gappsHandler', ''),
        new exports["gapps"]()
    )

    .when(
        new TextCommand('/gcam', 'gcamHandler', ''),
        new exports["gcam"]()
    )

    .when(
        new TextCommand('/havoc', 'havocBuildHandler', ''),
        new exports["havoc"]()
    )

    .when(
        new TextCommand('/labs', 'labsHandler', ''),
        new exports["labs"]()
    )

    .when(
        new TextCommand('/lineage', 'lineageBuildHandler', ''),
        new exports["lineage"]()
    )

    .when(
        new TextCommand('/magisk', 'magiskHandler', ''),
        new exports["magisk"]()
    )

    .when(
        new TextCommand('/microg', 'microgHandler', ''),
        new exports["microg"]()
    )

    .when(
        new TextCommand('/omni', 'omniBuildHandler', ''),
        new exports["omni"]()
    )

    .when(
        new TextCommand('/pecaf', 'pecafBuildHandler', ''),
        new exports["pecaf"]()
    )

    .when(
        new TextCommand('/pe', 'pexBuildHandler', ''),
        new exports["pex"]()
    )


    .when(
        new TextCommand('/pixys', 'pixysBuildHandler', ''),
        new exports["pixy"]()
    )

    .when(
        new TextCommand('/posp', 'potatoBuildHandler', ''),
        new exports["potato"]()
    )

    .when(
        new TextCommand('/revenge', 'revengeBuildHandler', ''),
        new exports["revenge"]()
    )

    .when(
        new TextCommand('/rr', 'rrBuildHandler', ''),
        new exports["rr"]()
    )

    .when(
        new TextCommand('/syberia', 'syberiaBuildHandler', ''),
        new exports["syberia"]()
    )

    .when(
        new TextCommand('/twrp', 'twrpHandler', ''),
        new exports["twrp"]()
    )

    .when(
        new TextCommand('/viper', 'viperBuildHandler', ''),
        new exports["viper"]()
    )

    .when(
        new TextCommand('/gsi', 'gsiHandler', ''),
        new exports["gsi"]()
    )

    .when(
        new TextCommand('/superior', 'superiorBuildHandler', ''),
        new exports["superior"]()
    )

    .when(
        new TextCommand('/aqua', 'aquaBuildHandler', ''),
        new exports["aquari"]()
    )

    .when(
        new TextCommand('/validus', 'validusBuildHandler', ''),
        new exports["gzr"]()
    )

    .when(
        new TextCommand('/gzosp', 'gzospBuildHandler', ''),
        new exports["gzr"]()
    )

    .when(
        new TextCommand('/candy', 'candyBuildHandler', ''),
        new exports["candy"]()
    )

    .when(
        new TextCommand('/kraken', 'krakenBuildHandler', ''),
        new exports["kraken"]()
    )

    .when(
        new TextCommand('/pixeldust', 'pixeldustBuildHandler', ''),
        new exports["pixeldust"]()
    )

    .when(new TextCommand('/xda device', 'xdaDeviceHandler', 'Search for device forums on XDA'), new exports["xda"]())
    .when(new TextCommand('/xda user', 'xdaUserHandler', 'Search users on XDA'), new exports["xda"]())
    .when(new TextCommand('/xda browse', 'xdaBrowseHandler', 'Browse XDA forums'), new exports["xda"]())
    .when(new TextCommand('/xda forum', 'xdaSearchHandler', 'Find forums on XDA'), new exports["xda"]())
    .when(new TextCommand('/xda news', 'xdaNewsHandler', 'Get latests news from XDA Portal \n Usage : /xda news\n/xda news vendorname'), new exports["xda"]())
    .when(new TextCommand('/xda upload', 'xdaUploadHandler', ''), new exports["xda"]())
    .when(new TextCommand('/xda thread', 'xdaThreadHandler', ''), new exports["xda"]())
    .when(new TextCommand('/xda portal', 'xdaPortalHandler', ''), new exports["xda"]())
    .when(new TextCommand('/xda follow', 'xdaFollowHandler', 'Get notified on lastests posts for given threads\nUsage : /xda follow threadid\n/xda follow rm threadid\n/xda follow clear/\n/xda follow get'), new exports["xda"]())
    .when(new TextCommand('/devdb', 'devDBHandler', ''), new exports["xda"]())

    .when(
        new TextCommand('/xposed', 'xposedHandler', ''),
        new exports["xposed"]()
    )

    .when(
        new TextCommand('/xtended', 'xtendedBuildHandler', ''),
        new exports["xtended"]()
    )

    .when(
        new TextCommand('/op', 'oneplusOTAHandler', ''),
        new exports["oneplus"]()
    )

    .when(
        new TextCommand('/moto', 'motorolaHandler', ''),
        new exports["motorola"]()
    )

    .when(
        new TextCommand('/xiaomi', 'xiaomiHandler', ''),
        new exports["xiaomi"]()
    )

    .when(
        new TextCommand('/asus', 'asusHandler', ''),
        new exports["asus"]()
    )

    .when(
        new TextCommand('/huawei', 'huaweiHandler', ''),
        new exports["huawei"]()
    )

    .when(
        new TextCommand('/repos', 'githubSearchHandler', ''),
        new exports["github"]()
    )

    .when(
        new TextCommand('/commits', 'githubCommitsHandler', ''),
        new exports["github"]()
    )

    .when(
        new TextCommand('/colt', 'coltBuildHandler', ''),
        new exports["colt"]()
    )

    .when(
        new TextCommand('/evox', 'evoBuildHandler', ''),
        new exports["evo"]()
    )

    .when(
        new TextCommand('/losg', 'licrogBuildHandler', ''),
        new exports["licrog"]()
    )

    .when(
        new TextCommand('/nanodroid', 'nanodroidHandler', ''),
        new exports["nanodroid"]()
    )

    .when(
        new TextCommand('/caf', 'cafHandler', ''),
        new exports["caf"]()
    )

    .when(
        new TextCommand('/getdump', 'dumpHandler', ''),
        new exports["github"]()
    )

    .when(
        new TextCommand('/deviceinfos', 'deviceInfosHandler', ''),
        new exports["deviceinfos"]()
    )

    .when(
        new TextCommand('/codename', 'codenameHandler', ''),
        new exports["deviceinfos"]()
    )

    .when(
        new TextCommand('/specs', 'deviceSpecsHandler', ''),
        new exports["deviceinfos"]()
    )

    .when(
        new TextCommand('/apk discover', 'discoverApkHandler', ''),
        new exports["cleanapk"]()
    )

    .when(
        new TextCommand('/apk top', 'topApkHandler', ''),
        new exports["cleanapk"]()
    )

    .when(
        new TextCommand('/apk search', 'searchApkHandler', ''),
        new exports["cleanapk"]()
    )

    .when(
        new TextCommand('/apk popular', 'popularApkHandler', ''),
        new exports["cleanapk"]()
    )


    .callbackQuery(new CallbackController())
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
