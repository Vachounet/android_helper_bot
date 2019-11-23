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
      $.sendMessage("Usage: /moto _keywords_\n*Ex.:* /moto griffin cid50", {
        parse_mode: "markdown",
        reply_to_message_id: $.message.messageId
      });
      return;
    }

    var keyword = $.command.arguments[0].trim()
    console.log(keyword)
    
    request.post(
      'https://mirrors.lolinet.com/firmware/moto/' + keyword + '/official/?', {
        json: {
          "action": "get",
          "search": {
            "href": "/firmware/moto/" + keyword + "/official/",
            "pattern": ".*?",
            "ignorecase": true
          }
        },
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Host": "mirrors.lolinet.com",
          "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
          "Referer": "https://mirrors.lolinet.com/firmware/moto/"+ keyword+"/official/"
        }
      },
      function(error, response, body) {
        var msg = "🔍 <b>Last firmware for " + keyword + " </b>: \n";
        if (body && body.search && body.search.length > 0) {
          body.search.sort(function(a, b) {
            if (new Date(a.time * 1000) < new Date(b.time * 1000))
              return 1;
            if (new Date(a.time * 1000) > new Date(b.time * 1000))
              return -1;
            return 0;
          });
          var kb = {
            inline_keyboard: []
          };
          var files = [];
          var allfiles = []
          for (var i = 0; i < body.search.length; i++) {
            if (body.search[i].href.indexOf("/" + keyword + "/") !== -1 &&
              body.search[i].href.indexOf(".zip") !== -1 && !allfiles.includes(body.search[i].href.split("/")[body.search[i].href.split("/").length - 1])) {
                 allfiles.push(body.search[i].href.split("/")[body.search[i].href.split("/").length - 1])
                //files.push({name: body.search[i].href.split("/")[body.search[i].href.split("/").length - 1], url: body.search[i].href});
                msg += "<a href='https://mirrors.lolinet.com" + body.search[i].href + "'>" +body.search[i].href.split("/")[body.search[i].href.split("/").length - 1] + "</a> \n"
                console.log(body.search[i])
                if (allfiles.length > 8)
                    break;
            }
          }
          //var filtered = kb.inline_keyboard.slice(1, 11);
          //kb.inline_keyboard = filtered
          
          
          $.sendMessage(msg, {
            parse_mode: "html",
            //reply_markup: JSON.stringify(kb),
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
}

async function getSignedURL(url) {

  // Return new promise
  // Do async job
  return await requestPromise.get(url)

}

module.exports = MotorolaController;
