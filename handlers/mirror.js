const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var exec = require('child_process').exec;
var url = require("url");
var path = require("path");
const dlPath = __dirname + "/../downloads/";
const fs = require('fs-extra');

class MirrorController extends TelegramBaseController {

  mirror($) {
    if (!$.command.success || $.command.arguments.length === 0 || $.command.arguments.length > 1) {
      $.sendMessage("Usage: /mirror url", {
        parse_mode: "markdown",
        reply_to_message_id: $.message.messageId
      });
      return;
    }

    var parsed = url.parse($.command.arguments[0]);
    var fileName = path.basename(parsed.pathname);
    fs.emptyDirSync(dlPath)
    exec('aria2c --auto-file-renaming=false -q -x 16 -s 16 -c -d ' + dlPath + ' ' + '"' + $.command.arguments[0] + '"', function callback(error, stdout, stderr) {
        if (!error) {
            BotUtils.uploadFile(dlPath + fileName, $)
        }
    });
  }

  get routes() {
    return {
      'mirrorHandler': 'mirror'
    }
  }

  get config() {
    return {
      commands: [{
        command: "/mirror",
        handler: "mirrorHandler",
        help: "Upload files to telegram"
      }],
      type: config.commands_type.TTOLS
    }
  }
}

module.exports = MirrorController;
