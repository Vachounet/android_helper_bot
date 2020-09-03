const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var exec = require('child_process').exec;
var url = require("url");
var path = require("path");
var archiver = require('archiver');
const dlPath = __dirname + "/../downloads/";
const jadxPath = __dirname + "/../jadx/";
const fs = require('fs-extra');

class JadxController extends TelegramBaseController {

    jadx($) {
        if (!$.command.success || $.command.arguments.length === 0 || $.command.arguments.length > 1) {
            $.sendMessage("Usage: /jadx url", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var parsed = url.parse($.command.arguments[0]);
        var fileName = path.basename(parsed.pathname);
        exec('aria2c --auto-file-renaming=false -q -x 16 -s 16 -c -d ' + dlPath + ' ' + '"' + $.command.arguments[0] + '"', function callback(error, stdout, stderr) {
            if (!error) {
                exec(jadxPath + 'bin/jadx -e --deobf -d ' + jadxPath + 'projects/' + fileName + ' ' + dlPath + fileName, function callback(error, stdout, stderr) {
                    var output = fs.createWriteStream(jadxPath + 'projects/' + fileName + ".zip");
                    var archive = archiver('zip', {
                        zlib: {
                            level: 9
                        }
                    });

                    archive.pipe(output);
                    archive.directory(jadxPath + 'projects/' + fileName + "/", fileName);

                    archive.on('error', function (err) {
                        return;
                    });

                    output.on('close', async function () {

                        BotUtils.uploadFile(jadxPath + 'projects/' + fileName + ".zip", $)

                    });

                    output.on('end', function () {
                        console.log('Data has been drained');
                    });

                    archive.finalize();
                })

            }
        });
    }

    get routes() {
        return {
            'jadxHandler': 'jadx'
        }
    }

    get config() {
        return {
            commands: [{
                command: "/jadx",
                handler: "jadxHandler",
                help: "Produces Java source code from Android Dex and Apk files"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = JadxController;
