'use strict'

const config = require('./config')

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const CustomFilterCommand = Telegram.CustomFilterCommand

// Export bot as global variable
global.tg = new Telegram.Telegram(config.token, {
    localization: [require('./localization/En.json')]
})


// Default Controllers
var CallbackController = require("./handlers/callbackQuery.js")
var InlineController = require("./handlers/inline.js")
var OtherwiseController = require("./handlers/custom_commands.js")

var normalizedPath = require("path").join(__dirname, "handlers");

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
        new TextCommand('/pe', 'pexBuildHandler', ''),
        new exports["pex"]()
    )

    .when(
        new TextCommand('/pe-caf', 'pecafBuildHandler', ''),
        new exports["pecaf"]()
    )

    .when(
        new TextCommand('/pixys', 'pixysBuildHandler', ''),
        new exports["pixy"]()
    )

    .when(
        new TextCommand('/pe-go', 'pegoBuildHandler', ''),
        new exports["pego"]()
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
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("https://rsdsecure-cloud.motorola.com/download/") !== -1
        }, 'rsdFilterHandler'),
        new exports["rsd"]()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("androidfilehost.com/?fid=") !== -1
        }, 'afhFilterHandler'),
        new exports["afh"]()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("/c/") !== -1
        }, 'gerritFilterHandler'),
        new exports["gerrit"]()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("drive.google.com") !== -1 &&
                ($.message.text.indexOf("view") !== -1 || $.message.text.indexOf("open?id=") !== -1 ||
                    $.message.text.indexOf("uc?id=") !== -1)
        }, 'gdriveFilterHandler'),
        new exports["gdrive"]()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("sourceforge.net") !== -1 &&
                $.message.text.indexOf("/download") !== -1
        }, 'sfFilterHandler'),
        new exports["sourceforge"]()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("github.com") !== -1 &&
                $.message.text.indexOf("/releases") !== -1 && $.message.text.indexOf("gapps") == -1
        }, 'githubFilterHandler'),
        new exports["github"]()
    )

    .when(
        new CustomFilterCommand($ => {
            return $.message.text.indexOf("play.google.com/store/apps/details?id=") !== -1
        }, 'playstoreFilterHandler'),
        new exports["playstore"]()
    )

    .callbackQuery(new CallbackController())
    .inlineQuery(new InlineController())
    .otherwise(new OtherwiseController())
