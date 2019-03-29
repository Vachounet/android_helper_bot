const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var extracommands = db.collection('extracommands')
var users = db.collection('users');
var chats = db.collection('chats');
var followedForums = db.collection('followed_forums');
var stats = db.collection('stats');

class OtherwiseController extends TelegramBaseController {

    handle($) {
        this.parseUser($)

        if ($.message.chat) {
            this.parseChat($);
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
