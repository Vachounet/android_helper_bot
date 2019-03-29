var request = require('request');
var rp = require('request-promise');
const util = require('util');
const JSDOM = require('jsdom');

const config = require("./config")
var mongojs = require('mongojs')
var db = mongojs(config.db.name)
var chats = db.collection('chats');

let Parser = require('rss-parser');
let parser = new Parser();

BotUtils = {}

BotUtils.getJSON = (url, cb) => {
    rp(url, {
            json: true,
            resolveWithFullResponse: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
            }
        }).then(function (response) {
            if (response.statusCode !== 200)
                return;

            if (response.headers['content-type'].indexOf('application/json') === -1) {

                if (response.headers['content-type'].indexOf("text/plain") !== -1 ||
                    response.headers['content-type'].indexOf("text/html") !== -1) {
                    try {
                        if (typeof response.body === "object") {
                            cb(response.body)
                        } else {
                            var json = JSON.parse(response.body);
                            cb(json)
                        }
                    } catch (e) {
                        //console.log(response.body)
                    }
                }
                return;
            }

            cb(response.body)
        })
        .catch(function (err) {
            console.log(err)
            //cb(null, err)
        });
}

BotUtils.humanFileSize = (bytes, si) => {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

BotUtils.getUrlParameter = (search, name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

BotUtils.ischannelAdmin = (userID, chatID, scope, cb) => {
    let isAdmin = false;

    if (scope.message.chat.type === "private") {
        cb(true);
        return;
    }

    scope.getChatAdministrators(chatID).then(data => {

        let msg = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].user && data[i].user.id === userID)
                    isAdmin = true;
            }
        }
        cb(isAdmin)
    });

}

BotUtils.getUserFromCmd = (original, command) => {

    var user = {
        username: "",
        userID: 0
    }

    if (original.reply_to_message && original.reply_to_message.from) {
        user.username = original.reply_to_message.from.username;
        user.userID = original.reply_to_message.from.id;
    } else {
        if (command[1].indexOf("@") > -1) {
            user.username = command[1].split("@")[1];
        } else {
            user.username = command[1];
        }

        if (user.username) {
            var userResult = TelegramBot.method('getChatMember', {
                chat_id: original.chat.id,
                user_id: "@" + user.username

            });

            user.userID = userResult.id;
        }
    }

    return user;
}

BotUtils.sendAFHMirrors = (fid, scope) => {
    request.post("https://androidfilehost.com/libs/otf/mirrors.otf.php", {
            form: {
                "submit": "submit",
                "action": "getdownloadmirrors",
                "fid": fid

            },
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Host": "androidfilehost.com",
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                "X-MOD-SBB-CTYPE": "xhr",
                "Referer": "https://androidfilehost.com/?fid=" + fid
            }
        },
        function (error, response, body) {

            if (error)
                return

            var json;
            try {
                json = JSON.parse(body);
            } catch (e) {
                console.log("AFH: error - fid: " + fid)
            }

            var links = "";

            if (json.STATUS === "1") {
                if (json.MIRRORS && json.MIRRORS.length > 0) {

                    for (var i = 0; i < json.MIRRORS.length; i++) {
                        links += "[" + json.MIRRORS[i].name + "](" + json.MIRRORS[i].url + ")  "
                    }

                } else {
                    scope.sendMessage(tg._localization.En.afhMirrorsNotFound, {
                        parse_mode: "markdown",
                        reply_to_message_id: scope.message.messageId
                    });
                    return;
                }
            }
            let msg = util.format(tg._localization.En.afhMirrors, json.MIRRORS[0].url.split("/")[json.MIRRORS[0].url.split("/").length - 1]);
            scope.sendMessage(msg + links, {
                parse_mode: "markdown",
                disable_web_page_preview: true,
                reply_to_message_id: scope.message.messageId
            });
        });
}

BotUtils.getSourceForgeBuilds = (scope, romInfos, device) => {
    parser.parseURL('https://sourceforge.net/projects/' + romInfos.projectName + '/rss?path=/' + romInfos.extraSFPath.replace("{0}", device), function (error, feed) {
        if (feed && feed.items && feed.items.length > 0) {
            for (var i = 0; i < feed.items.length; i++) {

                var item = feed.items[i];

                var fileName;
                var fileLink;

                if (item.title.toLocaleLowerCase().indexOf(device.toLocaleLowerCase()) !== -1 && item.title.indexOf(".md5") === -1) {

                    fileName = item.title.split("/")[romInfos.extraSFPath.indexOf("/") !== -1 ? 3 : 2];
                    fileLink = item.link

                    break;
                }
            }

            if (!fileName || !fileLink) {
                scope.sendMessage(tg._localization.En.deviceNotFound, {
                    parse_mode: "markdown",
                    reply_to_message_id: scope.message.messageId
                });
            } else {
                BotUtils.sendSourceForgeLinks(scope, fileLink, romInfos)
            }
        } else {
            scope.sendMessage(tg._localization.En.deviceNotFound, {
                parse_mode: "markdown",
                reply_to_message_id: scope.message.messageId
            });
        }
    });
}

BotUtils.sendSourceForgeLinks = (scope, link, romInfos) => {
    var links = "";
    var matches;

    if (!link) {
        matches = scope.message.text.match(/\bhttps?:\/\/\S+/gi);
    } else {
        matches = link.match(/\bhttps?:\/\/\S+/gi);
    }

    var filteredPath = matches[0].replace("/download", "");
    filteredPath = filteredPath.replace("/files", "");
    filteredPath = filteredPath.replace("/projects/", "");
    filteredPath = filteredPath.replace("https://sourceforge.net", "");

    var projectname = !romInfos ? matches[0].split("/")[4] : romInfos.projectName;

    filteredPath = filteredPath.replace(projectname, "");

    var mirrorsUrl = "https://sourceforge.net/settings/mirror_choices?projectname=" + projectname + "&filename=" + filteredPath;

    request.get(mirrorsUrl,
        function (error, response, body) {
            var dom = new JSDOM.JSDOM(body);
            var mirrors = dom.window.document.querySelectorAll("#mirrorList li");

            for (var i = 0; i < mirrors.length; i++) {
                if (i % 2) {
                    var mirrorName = mirrors[i].id;
                    links += "[" + mirrors[i].textContent.trim().split("(")[1].split(")")[0] + "](https://" + mirrorName + ".dl.sourceforge.net/project/" + projectname + filteredPath + ")  ";
                }
            }
            scope.sendMessage("*Mirrors for " + filteredPath.split("/")[filteredPath.split("/").length - 1] + "*\n" + links, {
                parse_mode: "markdown",
                disable_web_page_preview: true,
                reply_to_message_id: scope.message.messageId
            });
        });
}

// Based on https://github.com/JonDum/BBCode-To-Markdown-Converter/blob/gh-pages/index.js
BotUtils.convertBBCodeToMarkdown = (bbCodeContent) => {

    if (!bbCodeContent || typeof bbCodeContent !== 'string')
        return;

    try {
        //general BBcode conversion
        bbCodeContent = bbCodeContent
            .replace(/\[b\]((?:.|\n)+?)\[\/b\]/gmi, '**$1**') //bold; replace [b] $1 [/b] with ** $1 **
            .replace(/\[\i\]((?:.|\n)+?)\[\/\i\]/gmi, '*$1*') //italics; replace [i] $1 [/u] with * $1 *
            .replace(/\[\u\]((?:.|\n)+?)\[\/\u\]/gmi, '$1') //remove underline;
            .replace(/\[s\]((?:.|\n)+?)\[\/s\]/gmi, '~~ $1~~') //strikethrough; replace [s] $1 [/s] with ~~ $1 ~~
            .replace(/\[center\]((?:.|\n)+?)\[\/center\]/gmi, '$1') //remove center;
            .replace(/\[quote\=(.+?)\]((?:.|\n)+?)\[\/quote\]/gmi, function (match, p1, p2, offset, string) {
                return "`" + p1.split(";")[0] + " said:\n" + p2 + "`\n"
            })
            .replace(/\[size\=.+?\]((?:.|\n)+?)\[\/size\]/gmi, '## $1') //Size [size=] tags
            .replace(/\[color\=.+?\]((?:.|\n)+?)\[\/color\]/gmi, '$1') //remove [color] tags
            .replace(/\[list\=1\]((?:.|\n)+?)\[\/list\]/gmi, function (match, p1, offset, string) {
                return p1.replace(/\[\*\]/gmi, '1. ');
            })
            .replace(/(\n)\[\*\]/gmi, '$1* ') //lists; replcae lists with + unordered lists.
            .replace(/\[\/*list\]/gmi, '')
            .replace(/\[img\]((?:.|\n)+?)\[\/img\]/gmi, '![$1]($1)')
            .replace(/\[url=(.+?)\]((?:.|\n)+?)\[\/url\]/gmi, '[$2]($1)')
            .replace(/\[code\](.*?)\[\/code\]/gmi, '`$1`')
            .replace(/\[code\]((?:.|\n)+?)\[\/code\]/gmi, function (match, p1, offset, string) {
                return p1.replace(/^/gmi, '    ');
            })
            .replace(/\[php\](.*?)\[\/php\]/gmi, '`$1`')
            .replace(/\[php\]((?:.|\n)+?)\[\/php\]/gmi, function (match, p1, offset, string) {
                return p1.replace(/^/gmi, '    ');
            })
            .replace(/\[pawn\](.*?)\[\/pawn\]/gmi, '`$1`')
            .replace(/\[pawn\]((?:.|\n)+?)\[\/pawn\]/gmi, function (match, p1, offset, string) {
                return p1.replace(/^/gmi, '    ');
            });
    } catch (e) {
        return "";
    }

    return bbCodeContent;

}

BotUtils.getRomFilter = (scope, cb) => {
    chats.find({
        chatID: {
            $eq: scope.message.chat.id
        }
    }, function (err, docs) {
        if ((docs || docs.length > 0) && docs[0].filter) {
            if (docs[0].filter !== "" && !scope.message.text.startsWith("/" + docs[0].filter))
                return
            else
                cb(scope)
        } else {
            cb(scope)
        }
    });

}

RegExp.prototype.execAll = function (string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        var matchArray = [];
        for (i in match) {
            if (parseInt(i) == i) {
                matchArray.push(match[i]);
            }
        }
        matches.push(matchArray);
    }
    return matches;
}

module.exports = BotUtils
