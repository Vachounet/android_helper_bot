const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config.js")
var mongojs = require('mongojs')
var db = mongojs(config.db.name || process.env.DBNAME)
var motoFirmwares = db.collection('moto')
var requestPromise = require("request-promise")
var request = require('request');

class MotorolaController extends TelegramBaseController {

  getFirmwares($) {

    if (!$.command.success || $.command.arguments.length === 0) {
      $.sendMessage("Usage: /moto _keywords_\n*Ex.:* /moto QPWS30.61-21", {
        parse_mode: "markdown",
        reply_to_message_id: $.message.messageId
      });
      return;
    }

    var keyword = $.command.arguments[0].trim()


    const esc_pattern = sequence => {
      return sequence.replace(/[\-\[\]{}()*+?.,\\$\^|#\s]/g, '\\$&');
    };

    const parse_pattern = (sequence, advanced) => {
      if (!advanced) {
        return esc_pattern(sequence);
      }

      if (sequence.substr(0, 3) === 're:') {
        return sequence.substr(3);
      }

      return sequence.trim().split(/\s+/).map(part => {
        return part.split('').map(char => esc_pattern(char)).join('.*?');
      }).join('|');
    };

    request.post(
      'https://mirrors.lolinet.com/firmware/moto/?', {
      json: {
        "action": "get",
        "search": {
          "href": "/firmware/moto/",
          "pattern": parse_pattern(keyword, true),
          "ignorecase": true
        }
      },
      headers: {
        "content-type": "application/json;charset=utf-8",
        "Host": "mirrors.lolinet.com",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
        "Referer": "https://mirrors.lolinet.com/firmware/moto/"
      }
    },
      function (error, response, body) {
        var msg = "🔍 <b>Firmwares for " + keyword + " </b>: \n";

        if (body && body.search && body.search.length > 0) {

          body.search.sort(function (a, b) {
            if (new Date(a.time * 1000) < new Date(b.time * 1000))
              return 1;
            if (new Date(a.time * 1000) > new Date(b.time * 1000))
              return -1;
            return 0;
          });

          var allfiles = 0
          for (var i = 0; i < body.search.length; i++) {
            var channel = body.search[i].href.split("/")[body.search[i].href.split("/").length - 2]
            msg += channel + " <a href='https://mirrors.lolinet.com" + body.search[i].href + "'>" + body.search[i].href.split("/")[body.search[i].href.split("/").length - 1] + "</a> \n\n"
            allfiles = allfiles + 1;
            if (allfiles > 10)
              break;
          }

          $.sendMessage(msg, {
            parse_mode: "html",
            reply_to_message_id: $.message.messageId
          });
        } else {
          $.sendMessage(tg._localization.En.deviceNotFound, {
            parse_mode: "markdown",
            reply_to_message_id: $.message.messageId
          });
        }
      });
  }

  get routes() {
    return {
      'motorolaHandler': 'getFirmwares',
    }
  }

  get config() {
    return {
      commands: [{
        command: "/moto",
        handler: "motorolaHandler",
        help: "Search for Motorola firmwares"
      }],
      type: config.commands_type.FIRMWARE
    }
  }
}

async function getSignedURL(url) {

  // Return new promise
  // Do async job
  return await requestPromise.get(url)

}

module.exports = MotorolaController;
