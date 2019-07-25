const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var spawn = require('child_process').spawn;
var Queue = require('better-queue');

var q = new Queue(function (input, cb) {

    var $ = input.scope;
    var initialMessage = "Starting dump...";
    $.sendMessage(initialMessage, {
        parse_mode: "markdown",
        reply_to_message_id: $.message.messageId
    }).then(function (msg) {

        var dump = spawn(__dirname + "/../dumpyara/dumpyara.sh", [$.command.arguments[0], config.github_token]);
        dump.stdout.on('data', function (data) {

            var message = data.toString();

            initialMessage = initialMessage + "\n" + message.trim()

            tg.api.editMessageText("`" + initialMessage + "`", {
                parse_mode: "markdown",
                chat_id: msg._chat._id,
                disable_web_page_preview: true,
                message_id: msg._messageId
            });
        });

        dump.stderr.on('data', function (data) {
            //console.log('stderr: ' + data.toString());
        });

        dump.on('exit', function (code) {
            //console.log('child process exited with code ' + code.toString());
            cb()
        });
    });
}, {
    concurrent: 1,
    batchSize: 1
})

class DumpController extends TelegramBaseController {

    dump($) {

        if (!config.dump_feature_enabled)
            return

        if (!config.dump_sudoers.includes($.message.from.id))
            return

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /ddump url", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        q.push({
            scope: $,
            url: $.command.arguments[0]
        })
        $.sendMessage("Job added to queue", {
            parse_mode: "markdown",
            reply_to_message_id: $.message.messageId
        })
    }

    get routes() {
        return {
            'dumpHandler': 'dump',
        }
    }
}

module.exports = DumpController;
