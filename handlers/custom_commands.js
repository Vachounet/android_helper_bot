const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var users = db.collection('users');
var chats = db.collection('chats');
const urlparser = require('url');
const util = require('util');
var exec = require('child_process').exec;
const BotUtils = require('../utils')
const request = require('request')
const JSDOM = require('jsdom')

class OtherwiseController extends TelegramBaseController {

    handle($) {

        if ($.message.entities && $.message.entities.length > 0) {
            var links = $.message.entities.filter(entity => entity.type === "url" || entity.type === "text_link");

            if (links.length > 0) {

                links.forEach(function (link) {
                    var url;
                    if (link.type === "url") {
                        var offset = link.offset || 0;

                        url = $.message.text.slice(offset, link.length + offset);
                    } else if (link.type === "text_link") {
                        url = link.url;
                    }

                    if (url) {
                        if (url.indexOf("https://rsdsecure-cloud.motorola.com/download/") !== -1) {
                            OtherwiseController.handleRSD($, url)
                        } else if (url.indexOf("androidfilehost.com/?fid=") !== -1) {
                            OtherwiseController.handleAFH($, url)
                        } else if (url.indexOf("/c/") !== -1) {
                            OtherwiseController.handleGerrit($, url)
                        } else if (url.indexOf("sourceforge.net") !== -1 &&
                            url.indexOf("/download") !== -1) {
                            OtherwiseController.handleSF($, url)
                            //} else if (url.indexOf("drive.google.com") !== -1 &&
                            //    (url.indexOf("view") !== -1 || url.indexOf("open?id=") !== -1 ||
                            //        url.indexOf("uc?id=") !== -1)) {
                            //     OtherwiseController.handleGDrive($, url)
                        } else if (url.indexOf("github.com") !== -1 &&
                            url.indexOf("/releases") !== -1 && url.indexOf("gapps") === -1) {
                            OtherwiseController.handleGithub($, url)
                        } else if (url.indexOf("play.google.com/store/apps/details?id=") !== -1) {
                            OtherwiseController.handlePlayStore($, url)
                        } else if (url.indexOf("https://mega.nz/file") !== -1) {
                            OtherwiseController.handleMega($, url)
                        } else if (url.indexOf("https://mega.nz/#!") !== -1) {
                            var temp_url = url.replace(/#!/,'file/');
                            temp_url = temp_url.replace(/!/,'#');
                            OtherwiseController.handleMega($, temp_url)
                        } else if (url.indexOf("osdn.net/projects/") !== -1 &&
                            url.indexOf("storage") !== -1) {
                            OtherwiseController.handleOSDN($, url)
                        } else if (url.indexOf("mediafire.com/file/") !== -1) {
                            OtherwiseController.handleMediafire($, url)
                        } else if (url.indexOf("/job/") !== -1) {
                            OtherwiseController.handleJenkins($, url)
                        }
                    }

                })

            }
        }

        this.parseUser($)

        if ($.message.chat) {
            this.parseChat($);
        }
    }

    static handleJenkins($, url) {
        var urls = url.split("/");
        console.log(urls)
        if (urls[3] === "job" && urls[5]) {
            let jenkins = require('jenkins')({
                baseUrl: url.split("/job/")[0]
            });
            jenkins.build.get(urls[4], parseInt(urls[5]), function (err, data) {
                if (err) {
                    return
                }

                var msg = "*Job* : `" + data.fullDisplayName + "`\n"

                if (data.actions) {
                    data.actions.forEach(action => {
                        if (action.parameters) {
                            action.parameters.forEach(param => {

                                if (param.name.toLowerCase().includes("device")) {
                                    msg += "*Device* : `" + param.value + "`\n";
                                } else if (param.name.toLowerCase().includes("version")) {
                                    msg += "*Version* : `" + param.value + "`\n";
                                } else if (param.name.toLowerCase().includes("user")) {
                                    msg += "*By* : `" + param.value + "`\n";
                                } else if (param.name.toLowerCase().includes("branch")) {
                                    msg += "*Branch* : `" + param.value + "`\n";
                                }
                            })
                        }
                    })
                }

                if (data.building) {
                    msg += "*Build running*"
                } else {
                    msg += "*Result* : `" + data.result + "`"
                }

                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            });
        }
    }

    static handleMediafire($, url) {
        request.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
            }
        }, function (error, response, body) {
            var dom = new JSDOM.JSDOM(body); //
            var link = dom.window.document.querySelector("a[aria-label*='Download file']").href
            var fileName = dom.window.document.querySelector("div.filename").textContent.trim()
            $.sendMessage("Download: [" + fileName + "](" + link + ")", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
        })
    }

    static handleOSDN($, url) {
        request.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
            }
        }, function (error, response, body) {
            var dom = new JSDOM.JSDOM(body);

            var link = dom.window.document.querySelector("a.mirror_link")
            if (!link) {
                return;
            }

            link = "https://osdn.net" + link.href;

            var currentMirror = new RegExp('m=(.*)&f', 'gmi').exec(link)[1]
            var message = "*Mirrors for * `" + url.split("/")[url.split("/").length - 2] + "`\n"

            var mirrors = dom.window.document.querySelector('#mirror-select-form').querySelectorAll('tr');

            if (!mirrors || mirrors.length === 0)
                return;

            for (let mirror of mirrors) {
                var currentLine = mirror.querySelectorAll("td")[2]

                if (!currentLine)
                    continue

                var mirrorText = currentLine.textContent.trim().split("(")[1].replace(")", "");
                message += "[" + mirrorText + "](" + link.replace(currentMirror, mirror.querySelector('input').value) + ")  "
            }

            $.sendMessage(message, {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });

        })
    }

    static handleMega($, url) {

        var kb = {
            inline_keyboard: []
        };

        if ($.message.chat.type === "private") {
            exec(__dirname + "/../megadown -q '" + url + "'", function callback(error, stdout, stderr) {
                try {
                    var json = JSON.parse(stdout);

                    tg.api.sendMessage($.message.from.id, "<b>Download Link</b> :\n<a href='"+json.url+"'>" + json.file_name + "</a>", {
                        parse_mode: "html",
                        reply_markup: JSON.stringify(kb)
                    });
                } catch (e) {
                    console.log(e)
                 }
            });
        } else {

            kb.inline_keyboard.push(
                [{
                    text: "Click here to get it through PM",
                    callback_data: "mega|" + url.split("/file/")[1]
                }]);

            $.sendMessage("*Generate download link* ", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        }

    }

    static handlePlayStore($, url) {

        var packageName = url.split("?id=")[1];

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

                                if (!dom.window.document.querySelector("#download_link")) {
                                    return;
                                }

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

    static handleGithub($, url) {

        var tag;
        if (url.indexOf("/tags/") !== -1) {
            tag = url.split("/tags/")[1];
        }

        var owner = url.split("/")[3];
        var repo = url.split("/")[4];

        BotUtils.getJSON("https://api.github.com/repos/" + owner + "/" + repo + "/releases",
            function (json, err) {

                var item;

                if (tag) {
                    for (var i = 0; i < json.length; i++) {
                        if (json[i].tag_name === tag) {
                            item = json[i];
                        }
                    }
                } else
                    item = json[0];

                var msg = "*" + item.name + " release by " + item.author.login + " on " + item.published_at.split("T")[0] + " *: \n\n"

                for (var i = 0; i < item.assets.length; i++) {
                    msg += "Downloads: " + item.assets[i].download_count + " \n"
                    msg += "FileSize: " + BotUtils.humanFileSize(item.assets[i].size, true) + " \n"
                    //msg += "Note: \n " + item.body + " \n"
                    msg += "[" + item.assets[i].name + "](" + item.assets[i].browser_download_url + ") \n\n"
                }
                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    static handleSF($, url) {
        BotUtils.sendSourceForgeLinks($, url)
    }

    static handleGDrive($, url) {
        var fileID = "";

        if (url.indexOf("view") !== -1) {
            fileID = url.split("/")[5];
        } else if (url.indexOf("open?id=") !== -1) {
            fileID = url.split("open?id=")[1].trim()
        } else if (url.indexOf("uc?id=") !== -1) {
            fileID = url.split("uc?id=")[1].trim()
        }

        var cookieRequest = request.defaults({
            jar: true
        })

        var exportURL = "https://drive.google.com/uc?export=download&id=" + fileID;
        cookieRequest.get({
                url: exportURL,
                followRedirect: false
            },
            function (error, response, body) {

                if (response.headers.location) {
                    if (response.headers.location.indexOf("accounts.google.com") !== -1) {
                        //Ignore non public links
                        return;
                    }

                    $.sendMessage("[Direct Download Link](" + response.headers.location + ")", {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                    return;
                }

                var dom = new JSDOM.JSDOM(body);

                var fileName = dom.window.document.querySelector(".uc-name-size a").textContent;

                var dlLink = "https://drive.google.com" + dom.window.document.querySelector("#uc-download-link").href;

                cookieRequest.get({
                        url: dlLink,
                        followRedirect: false
                    },
                    function (error, response, body) {

                        if (response.headers.location && response.headers.location.indexOf("accounts.google.com") !== -1) {
                            // Non public link
                            return;
                        }

                        $.sendMessage("Direct Download : <a href='" + response.headers.location + "'>" + fileName + "</a>", {
                            parse_mode: "html",
                            reply_to_message_id: $.message.messageId
                        });
                    });
            });
    }

    static handleGerrit($, url) {

        /// TODO: use regex
        var cid = url.split("/c/")[1].split("+/")[1].split("/")[0];

        var newURL = url.split("/c/")[0].replace("/#", "");

        request.get(newURL + "/changes/" + cid + "/detail",
            function (error, response, body) {
                var json = JSON.parse(body.split("'")[1])

                var msg = "*Subject*: `" + json.subject + "`";
                msg += "\n*Project* : `" + json.project + "`";
                msg += "\n*Branch* : `" + json.branch + "`";
                msg += "\n*Status* : `" + json.status + "`";
                msg += "\n*Owner* : `" + json.owner.name + "`";
                if (json.topic) {
                    msg += "\n*Topic* : `" + json.topic + "`";
                }

                $.sendMessage(msg, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            });
    }

    static handleAFH($, url) {
        var fid = url.split("fid=")[1].split(" ")[0];

        if (fid.indexOf(" ") !== -1) {
            fid = fid.split(" ")[0];
        }
        BotUtils.sendAFHMirrors(fid, $);
    }

    static handleRSD($, url) {
        const myURL = urlparser.parse(url);

        var expiresParam = BotUtils.getUrlParameter(myURL.search, "Expires");

        var expireDate = new Date(parseInt(expiresParam) * 1000);

        var currentDate = new Date();

        if (currentDate > expireDate) {
            var msg = util.format(tg._localization.En.rsdLinkExpired, expireDate.toGMTString());

            request.get("https://signedurl-svjhrfxmfa.now.sh/?url=" + matches[0].split("?")[0],
                function (error, response, body) {
                    msg += (body)
                    $.sendMessage(msg, {
                        parse_mode: "html",
                        reply_to_message_id: $.message.messageId
                    });

                });

        } else {
            $.sendMessage(util.format(tg._localization.En.rsdLinkWarning, expireDate.toGMTString()), {
                parse_mode: "html",
                reply_to_message_id: $.message.messageId
            });
        }
    }

    parseUser(scope) {
        users.find({
            userID: {
                $eq: scope.message.from.id
            }
        }, function (err, docs) {
            if (!docs || docs.length === 0) {

                users.save({
                    userID: scope.message.from.id,
                    userInfos: scope.message.from
                })
            }
        });
    }

    parseChat(scope) {
        chats.find({
            chatID: {
                $eq: scope.message.chat.id
            }
        }, function (err, docs) {
            if (!docs || docs.length === 0) {

                chats.save({
                    chatID: scope.message.chat.id,
                    chatInfos: scope.message.chat
                })
            }
        });
    }
}

module.exports = OtherwiseController;
