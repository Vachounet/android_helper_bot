const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const request = require('request')
const config = require("../config.js")
const deldogHost = "https://del.dog";
const deldogUploadEndpoint = "/documents";
const JSDOM = require('jsdom')

class AndroidDevController extends TelegramBaseController {
    search($) {

        if ($.command.arguments.length > 0) {

            var query = $.command.arguments.join(" ");

            request.get("https://developer.android.com/_d/search/suggestions?r=%5B%22" + query + "%22%2Cnull%2Cnull%2Cnull%2Cnull%2Ctrue%2Ctrue%2Ctrue%2Ctrue%5D",
                function (error, response, body) {
                    var json = JSON.parse(body)
                    var msg = "";
                    json[1].forEach(result => {
                        if (result[1] && result[1].includes("developer")) {
                            msg += "<a href='" + result[1] + "'>" + result[0] + "</a>\n"
                        }
                    })
                    if (msg !== "") {
                        $.sendMessage(msg, {
                            parse_mode: "html",
                            reply_to_message_id: $.message.messageId,
                            disable_web_page_preview: true
                        });
                    }
                })
        }
    }

    studio($) {
        console.log("get studio")
        request.get("https://developer.android.com/studio",
            function (error, response, body) {

                var kb = {
                    inline_keyboard: []
                };
                var dom = new JSDOM.JSDOM(body)
                var links = dom.window.document.querySelectorAll(".agreed a");
                var msg = "*Android Studio :*"
                kb.inline_keyboard.push(
                    [{
                        text: "Windows (64-bit)",
                        url: links[3].href
                    }, {
                        text: "Windows (32-bit)",
                        url: links[4].href
                    }]);

                kb.inline_keyboard.push(
                    [{
                        text: "Mac (64-bit)",
                        url: links[2].href
                    }, {
                        text: "Linux (32-bit)",
                        url: links[0].href
                    }]);
                kb.inline_keyboard.push(
                    [{
                        text: "Chrome OS",
                        url: links[1].href
                    }])

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb),
                        reply_to_message_id: $.message.messageId,
                        disable_web_page_preview: true
                    });
            })
    }

    get routes() {
        return {
            'androidDevHandler': 'search',
            'androidStudioHandler': 'studio'
        }
    }

    get config() {
        return {
            commands: [{
                    command: "/dev",
                    handler: "androidDevHandler",
                    help: "Search on developers.android.com"
                },
                {
                    command: "/astudio",
                    handler: "androidStudioHandler",
                    help: "Get links to latest Android Studio packages"
                }
            ],
            type: config.commands_type.DEVELOPERS
        }
    }
}
module.exports = AndroidDevController