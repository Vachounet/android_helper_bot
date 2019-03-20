var request = require('request');
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
