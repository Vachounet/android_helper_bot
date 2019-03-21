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
