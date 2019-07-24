const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var chats = db.collection('chats');

class FilterRomController extends TelegramBaseController {

    search($) {

        var command = $.message.text.replace("/filterrom", "").trim().split(" ");

        if (command.length === 0 || command.length > 1 || command[0] === "") {
            $.sendMessage("Usage: /filterrom commandname \n/filterrom off", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        if (command === "off") {
            command = "";
        }

        if ($.message.chat.type === "private") {

            chats.find({
                chatID: {
                    $eq: $.message.chat.id
                }
            }, function (err, docs) {
                if (docs && docs.length > 0) {

                    chats.update({
                        _id: docs[0]._id
                    }, {
                        $set: {
                            filter: command
                        }
                    });
                    var msg = command === "" ? "Filter disable" : "Filter updated to " + command;
                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_to_message_id: $.message.messageId
                    });
                    return;
                }
            });
            return;
        }

        $.getChatAdministrators($.message.chat.id).then(data => {
            var isAdmin = false;
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].user && data[i].user.id === $.message.from.id)
                        isAdmin = true;
                }
            }
            if (isAdmin) {
                chats.find({
                    chatID: {
                        $eq: $.message.chat.id
                    }
                }, function (err, docs) {
                    if (docs || docs.length > 0) {

                        chats.update({
                            _id: docs[0]._id
                        }, {
                            $set: {
                                filter: command
                            }
                        });
                        var msg = command === "" ? "Filter disable" : "Filter updated to " + command;

                        $.sendMessage(msg, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                    }
                });
            } else {
                $.sendMessage("Only admins are allowed to use this command", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        });
    }

    get routes() {
        return {
            'filterRomHandler': 'search',
        }
    }
}



module.exports = FilterRomController;
