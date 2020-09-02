const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require("../config")
var exec = require('child_process').exec;

const { Client } = require('tlg')
const client = new Client({
    apiId: config.api_id, 
    apiHash: config.api_hash
})

class GPlayController extends TelegramBaseController {

    async download($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /gp appid/appurl", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var appId = BotUtils.getUrlParameter($.command.arguments[0], 'id') || $.command.arguments[0]

        exec('gplaycli -tu "http://auroraoss.com:8080" -d "'+appId+'" -f ' + __dirname + "/../apks/", async function callback(error, stdout, stderr) {
            try {
                await client.connect('bot', config.token)
                await client.getChat($.message.chat.id)
                await client.getUser($.message.from.id)
                $.sendChatAction('upload_document')
                await client.request('sendMessage', {
                    chat_id: $.message.chat.id,
                    reply_to_message_id:$.message.messageId,
                    input_message_content: {
                        '@type': 'inputMessageDocument',
                        document: {
                            '@type': 'inputFileLocal',
                            path: __dirname + "/../apks/" + appId + ".apk"
                        }
                    }
                })
                client.on('__updateMessageSendSucceeded', client.close)
            } catch (e) {
                console.log(e)
            }
        });
    }
    get routes() {
        return {
            'gplayHandler': 'download'
        }
    }

    get config() {
        return {
            commands: [{
                command: "/gp",
                handler: "gplayHandler",
                help: "Download apk from Google Play Store"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = GPlayController;