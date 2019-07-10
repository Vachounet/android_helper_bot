const Telegram = require('telegram-node-bot')
const TelegramBaseCallbackQueryController = Telegram.TelegramBaseCallbackQueryController;

const BotUtils = require("../utils.js")
var request = require('request');
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
                case "help":
                    this.handleHelp($, params)
                    break;
                case "mega":
                    this.handleMega($, params)
                    break;
            }
        }
    }

    handleHelp($, params) {
        var msg;

        var kb = {
            inline_keyboard: []
        };


        switch (params[1]) {
            case "main":

                var kb = {
                    inline_keyboard: []
                };

                kb.inline_keyboard.push(
            [{
                        text: "APKMirror",
                        callback_data: "help|am"
            }, {
                        text: "AndroidFileHost",
                        callback_data: "help|afh"
            }]);
                kb.inline_keyboard.push(
            [{
                            text: "OpenGapps",
                            callback_data: "help|gapps"
                },
                        {
                            text: "GoogleCamera",
                            callback_data: "help|gcam"
                }
            ]);

                kb.inline_keyboard.push(
            [{
                            text: "TWRP",
                            callback_data: "help|twrp"
                },
                        {
                            text: "NanoDroid",
                            callback_data: "help|nanodroid"
                }
            ]);
                kb.inline_keyboard.push(
                [{
                        text: "XDA",
                        callback_data: "help|xda"
                }, {
                        text: "GitHub",
                        callback_data: "help|github"
                }]);
                kb.inline_keyboard.push(
                    [{
                        text: "ROMs",
                        callback_data: "help|roms"
                    }, {
                        text: "Magisk",
                        callback_data: "help|magisk"
                    }]);
                kb.inline_keyboard.push(
                        [{
                        text: "ADB/Fastboot",
                        callback_data: "help|adb"
                        }, {
                        text: "microG",
                        callback_data: "help|microg"
                        }]);
                kb.inline_keyboard.push(
                        [{
                        text: "Firmwares",
                        callback_data: "help|firmware"
                        }, {
                        text: "GSI",
                        callback_data: "help|gsi"
                        }]);
                kb.inline_keyboard.push(
                        [{
                        text: "Direct Link Generator",
                        callback_data: "help|directlinks"
                        }, {
                        text: "CAF",
                        callback_data: "help|caf"
                        }]);
                msg = "Commands List"

                break;
            case "am":
                msg = "/am search keywords | Search for APKs on APKMirror"
                break;
            case "xda":
                msg = "/xda user _username_ | Search for a profile on XDA \n"
                msg += "/xda device _keywords_ | Search for device forums on XDA \n"
                msg += "/xda forum _keywords_ | Search for forums on XDA \n"
                msg += "/xda thread _keywords_ | Search for threads on XDA \n"
                msg += "/xda news | Get latests news from XDA\n"
                msg += "/xda follow _threadid_ | Get notified on new posts for the given thread. (Admin command on groups) \n"
                msg += "/labs _keywords_ | Search for apps on XDA Labs"
                break;
            case "gcam":
                msg = "/gcam _devname_ | Search for Google Camera mods \n"
                break;
            case "twrp":
                msg = "/twrp _devicecodename_ | Search for official TWRP images \n"
                break;
            case "stock":
                msg = "/stock _devicecodename_ | Search for official firmwartes for Motorola devices \n"

                break;
            case "gapps":
                msg = "/gapps _version_ _type_ | Search for lastests OpenGapps packages (arm or arm64) \n\n*Version* = Android version (from 5.1 to 9.0)\n*Type* = arm or arm64\n\n*Default to 9.0 and arm64*"

                break;
            case "afh":
                msg = "/afh search _keyword1_ _keyword2_ | Search for files on AndroidFileHost. Direct links will be generated. \n"

                break;
            case "roms":
                msg = "*Search for latests official builds*\n\n"
                msg += "*Usage* : /rom _devicecodename_ (Ex.: /omni potter)\n\n"

                msg += "You can use the /filterrom command to allow one command only\n"
                msg += "Ex.: _/filterrom omni_ will block all other commands, only /omni will be allowed\n\n"

                msg += "Supported ROMs/commands : \n"
                msg += "/aex (AOSPExtended)\n"
                msg += "/aicp (Android Ice Cold Project)\n"
                msg += "/aosip (Android Open Source illusion Project)\n"
                msg += "/arrow (ArrowOS)\n"
                msg += "/aqua (AquariOS)\n"
                msg += "/bootleg (Bootleggers)\n"
                msg += "/candy (CandyROMs)\n"
                msg += "/carbon (CarbonROM)\n"
                msg += "/cos (CosmicOS)\n"
                msg += "/cosp (Clean Open Source Project)\n"
                msg += "/crdroid (crDroidAndroid)\n"
                msg += "/dotos (dotOS)\n"
                msg += "/du (DirtyUnicorns)\n"
                msg += "/gzosp (GZOSP)\n"
                msg += "/havoc (HavocOS)\n"
                msg += "/kraken (Kraken Open Tentacles Project)\n"
                msg += "/lineage (LineageOS)\n"
                msg += "/losg (LineageOS for microG)\n"
                msg += "/omni (OmniROM)\n"
                msg += "/pe (PixelExperience)\n"
                msg += "/pecaf (PixelExperience CAF Edition)\n"
                msg += "/pego (PixelExperience GO Edition)\n"
                msg += "/pixeldust (PixelDust Project)\n"
                msg += "/pixys (PixysOS)\n"
                msg += "/posp (Potato Open Source Project)\n"
                msg += "/revenge (RevengeOS)\n"
                msg += "/rr (Resurrectionremix)\n"
                msg += "/syberia (Syberia OS)\n"
                msg += "/validus (Validus)\n"
                msg += "/viper (ViperOS)\n"
                msg += "/xtended (MSM Xtended)\n"
                break;
            case "github":
                msg = "/repos keywords | Search for repositories on GitHub\n\n"
                msg += "/commits keywords | Search for commits on GitHub\n\n"
                break;
            case "magisk":
                msg = "/magisk | Get latests Magisk and Magisk Manager"
                break;
            case "adb":
                msg = "/adb - /fastboot | Get latests SDK Platform Tools"
                break;
            case "caf":
                msg = "/caf keyword | Get latest tag based on given keyword\nEx.: /caf msm8996"
                break;
            case "microg":
                msg = "/microg | Get latests microG packages"
                break;
            case "nanodroid":
                msg = "/nanodroid | Get latests NanoDroid Magisk Modules/extras"
                break;
            case "firmware":
                msg = "Search for OFFICIAL OEM firmwares\n\n"
                msg += "Usage: /oemname devicecodename ( Ex: /moto harpia )\n"
                msg += "Tap a specific command for more help\n\n"
                msg += "Supported OEMs/commands \n"
                msg += "/moto ( Motorola )\n"
                msg += "/op ( Oneplus )\n"
                msg += "/xiaomi ( Xiaomi )\n"
                msg += "/asus ( Asus )\n"
                msg += "/huawei ( Huawei )\n"
                break;

            case "gsi":
                msg = "Search for Generic System Images\n\n"
                msg += "Usage: /gsi ( Tap command for more info )\n"
                break;

            case "directlinks":
                msg = "Generate direct links for different sources\n\n"
                msg += "Usage: Paste downloadable links from supported source\n\n"
                msg += "Currently Supported:\n\n"
                msg += "`Google Drive\n`"
                msg += "`Mega\n`"
                msg += "`APKMirror\n`"
                msg += "`Android File Host a.k.a AFH\n`"
                msg += "`Sourceforge\n`"
                msg += "`Github Releases`"
        }

        if (params[1] !== "main") {
            kb.inline_keyboard.push([{
                text: "Back",
                callback_data: "help|main"
            }]);
        }

        tg.api.editMessageText(msg, {
            parse_mode: "markdown",
            chat_id: $.message.chat.id,
            reply_markup: JSON.stringify(kb),
            message_id: $.message.messageId
        });
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
