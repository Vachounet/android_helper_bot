var request = require('request');
const util = require('util');
BotUtils = {}
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
            var json = JSON.parse(body);

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
                reply_to_message_id: scope.message.messageId
            });
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
