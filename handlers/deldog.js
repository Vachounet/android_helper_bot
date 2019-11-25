const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const request = require('request')
const config = require("../config.js")
const deldogHost = "https://del.dog";
const deldogUploadEndpoint = "/documents";
class DDogController extends TelegramBaseController {
    sendData($) {
        if ($.command.arguments.length > 0) {
            request.post({
                    url: deldogHost + deldogUploadEndpoint,
                    body: $.message.text.split("/ddog ")[1]
                },
                function (error, response, body) {
                    var json = JSON.parse(body)
                    if (json.key) {
                        $.sendMessage("deldog URL : " + deldogHost + "/" + json.key, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId,
                            disable_web_page_preview: true
                        });
                    }
                })
        } else if ($.message._replyToMessage && $.message._replyToMessage.text) {
            request.post({
                    url: deldogHost + deldogUploadEndpoint,
                    body: $.message._replyToMessage.text
                },
                function (error, response, body) {
                    var json = JSON.parse(body)
                    if (json.key) {
                        $.sendMessage("deldog URL : " + deldogHost + "/" + json.key, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId,
                            disable_web_page_preview: true
                        });
                    }
                })
        } else if ($.message._replyToMessage && $.message._replyToMessage.document) {

            if (!$.message._replyToMessage.document.mimeType ||
                !$.message._replyToMessage.document.mimeType.includes("text")) {
                $.sendMessage("File type not supported", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId,
                    disable_web_page_preview: true
                });
                return
            }
            request.get("https://api.telegram.org/bot" + config.token + "/getFile?file_id=" + $.message._replyToMessage.document.fileId,
                function (error, response, body) {
                    var json = JSON.parse(body)
                    request.get("https://api.telegram.org/file/bot" + config.token + "/" + json.result.file_path,
                        function (error, response, body) {
                            request.post({
                                    url: deldogHost + deldogUploadEndpoint,
                                    body: body
                                },
                                function (error, response, body) {
                                    var json = JSON.parse(body)
                                    if (json.key) {
                                        $.sendMessage("deldog URL : " + deldogHost + "/" + json.key, {
                                            parse_mode: "markdown",
                                            reply_to_message_id: $.message.messageId,
                                            disable_web_page_preview: true
                                        });
                                    }
                                })
                        })
                }
            );
        }
    }

    get routes() {
        return {
            'deldogHandler': 'sendData',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/ddog",
                handler: "deldogHandler",
                help: "Post message or document content to del.dog and get the URL"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = DDogController;
