const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var spawn = require('child_process').spawn;
var url = require("url");
var fs = require('fs');
var archiver = require('archiver');
var path = require("path");
const apkPath = __dirname + "/../apks/";

class ApkToolController extends TelegramBaseController {

  apktool($) {
    if (!$.command.success || $.command.arguments.length === 0) {
      $.sendMessage("Usage: /reapk url", {
        parse_mode: "markdown",
        reply_to_message_id: $.message.messageId
      });
      return;
    }

    var parsed = url.parse($.command.arguments[0]);
    var fileName = path.basename(parsed.pathname);
    $.sendMessage("Downloading `" + fileName + "` and running apktool", {
      parse_mode: "markdown",
      reply_to_message_id: $.message.messageId
    })
    var download_task = spawn('aria2c --allow-overwrite=true --auto-file-renaming=false -q -j 16 -x 16 -s 16 -d ' + apkPath + ' ' + '"' + $.command.arguments[0] + '"', {
      shell: true
    });

    download_task.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
    });
    download_task.on('exit', function (code, signal) {
      var apktool_task = spawn("java -jar " + apkPath + "apktool.jar d '" + apkPath + fileName + "' -o '" + apkPath + fileName.split(".")[0] + "' -kf", {
        shell: true
      });
      apktool_task.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
      });
      apktool_task.on('exit', function (code, signal) {
        if (code !== 0) {
          $.sendMessage("Unable to decompile " + fileName + ", aborted", {
            parse_mode: "markdown",
            reply_to_message_id: $.message.messageId
          })
          return;
        }
        var output = fs.createWriteStream(apkPath + fileName + ".zip");
        var archive = archiver('zip', {
          zlib: {
            level: 9
          }
        });

        archive.pipe(output);
        archive.directory(apkPath + fileName.split(".")[0] + "/", fileName.split(".")[0]);

        archive.on('error', function (err) {
          return;
        });

        output.on('close', async function () {

          BotUtils.uploadFile(apkPath + fileName + ".zip", $)
          
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

  get config() {
    return {
      commands: [{
        command: "/reapk",
        handler: "apktoolHandler",
        help: "Decompile APKs"
      }],
      type: config.commands_type.TTOLS
    }
  }
}

module.exports = ApkToolController;
