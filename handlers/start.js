const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require('../config')
class StartController extends TelegramBaseController {

    help($, replaceMainmenu) {
        var kb = {
            inline_keyboard: []
        };

        var menu = [];
        Object.keys(config.commands_type).forEach(function (key) {

            menu.push({
                text: config.commands_type[key],
                cbname: config.commands_type[key],
                callback: (callbackQuery, message) => {

                    var msg = "";
                    for (var i = 0; i < tg.router._routes.length; i++) {
                        if (tg.router._routes[i].controller.config &&
                            tg.router._routes[i].controller.config.type &&
                            tg.router._routes[i].controller.config.type === callbackQuery.data)

                            tg.router._routes[i].controller.config.commands.forEach(command => {
                                if (!msg.includes(command.command))
                                    msg += command.command + " : " + command.help + " \n"
                            })


                    }

                    kb.inline_keyboard.push(
                        [{
                            text: "Back",
                            callback_data: "main_menu"
                        }]);

                    tg.api.answerCallbackQuery(callbackQuery.id);
                    tg.api.editMessageText(msg, {
                        parse_mode: "markdown",
                        chat_id: message.chat.id,
                        reply_markup: JSON.stringify(kb),
                        message_id: message.messageId
                    })
                }
            })
        })

        var msg = "Generate direct links for different sources\n\n"
        msg += "*Usage*: Paste downloadable links from supported source\n\n"
        msg += "Currently Supported:\n\n"
        msg += "`Google Drive\n`"
        msg += "`Mega\n`"
        msg += "`APKMirror\n`"
        msg += "`Android File Host a.k.a AFH\n`"
        msg += "`Sourceforge\n`"
        msg += "`Github Releases`\n"
        msg += "`OSDN`\n"
        msg += "`MediaFire`\n\n"
        msg += "You can also use the inline mode to search for GIFs\n\n"
        msg += "Help about commands :"

        if (replaceMainmenu) {
            $.runInlineMenu({
                layout: 2,
                method: 'updateMenu',
                params: [msg, {parse_mode: "markdown"}],
                menu: menu
            }, $.update.callbackQuery.message)
        } else {
            $.runInlineMenu({
                layout: 2,
                method: 'sendMessage',
                params: [msg, {parse_mode: "markdown"}],
                menu: menu
            })
        }
    }

    get routes() {
        return {
            'startHandler': 'help',
        }
    }

    get config() {
        return {
            commands: [{
                command: "/start",
                handler: "startHandler",
                help: "Display main menu"
            }, {
                command: "/help",
                handler: "startHandler",
                help: "Display main menu"
            }],
            type: config.commands_type.TTOLS
        }
    }
}

module.exports = StartController;
