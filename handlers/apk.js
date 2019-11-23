const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var spawn = require('child_process').spawn;
var url = require("url");
var fs = require('fs');
var archiver = require('archiver');
var path = require("path");


class ApkToolController extends TelegramBaseController {

  apktool($) {

    if (!config.dump_feature_enabled)
      return

    if (!config.dump_sudoers.includes($.message.from.id))
      return

    if (!$.command.success || $.command.arguments.length === 0) {
      $.sendMessage("Usage: /reapk url", {
        parse_mode: "markdown",
        reply_to_message_id: $.message.messageId
      });
      return;
    }

    var parsed = url.parse($.command.arguments[0]);
    console.log(path.basename(parsed.pathname));
    var fileName = path.basename(parsed.pathname);
    $.sendMessage("Downloading `" + fileName + "` and running apktool", {
      parse_mode: "markdown",
      reply_to_message_id: $.message.messageId
    })
    var download_task = spawn('aria2c --auto-file-renaming=false -q -j 16 -x 16 -s 16 -d /home/tg/android_helper_bot/apks/ ' + '"' + $.command.arguments[0] + '"', {
      shell: true
    });

    download_task.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
    });
    download_task.on('exit', function (code, signal) {
      var apktool_task = spawn("java -jar /home/tg/android_helper_bot/apks/apktool.jar d '/home/tg/android_helper_bot/apks/" + fileName + "' -o '/home/tg/android_helper_bot/apks/" + fileName.split(".")[0] + "' -kf", {
        shell: true
      });
      apktool_task.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
      });
      apktool_task.on('exit', function (code, signal) {
        console.log("code: " + code, "signal " + signal)
        if (code !== "0") {
          $.sendMessage("Unable to decompile " + fileName + ", aborted", {
            parse_mode: "markdown",
            reply_to_message_id: $.message.messageId
          })
          return;
        }
        var output = fs.createWriteStream("/home/tg/android_helper_bot/apks/" + fileName + ".zip");
        var archive = archiver('zip', {
          zlib: {
            level: 1
          }
        });

        archive.pipe(output);
        archive.directory("/home/tg/android_helper_bot/apks/" + fileName.split(".")[0] + "/", fileName.split(".")[0]);

        archive.on('error', function (err) {
          console.log(err);
          return;
        });

        output.on('close', async function () {

          $.sendDocument({
            path: "/home/tg/android_helper_bot/apks/" + fileName + ".zip",
            filename: fileName + '.zip'
          }, {
            parse_mode: "markdown",
            caption: "Decompiled using apktool",
            reply_to_message_id: $.message.messageId
          })
        });

        output.on('end', function () {
          console.log('Data has been drained');
        });

        archive.finalize();
      })
    })
  }

  get routes() {
    return {
      'apktoolHandler': 'apktool'
    }
  }
}

module.exports = ApkToolController;
