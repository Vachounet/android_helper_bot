const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

class StartController extends TelegramBaseController {

    help($) {
        var kb = {
            inline_keyboard: []
        };

        kb.inline_keyboard.push(
            [{
                text: "APKMirror",
                callback_data: "help|am"
            }, {
                text: "AndroidFileHost",
                callback_data: "help|afh"
            }]);
        kb.inline_keyboard.push(
            [{
                    text: "OpenGapps",
                    callback_data: "help|gapps"
                },
                {
                    text: "GoogleCamera",
                    callback_data: "help|gcam"
                }
            ]);

        kb.inline_keyboard.push(
            [{
                    text: "TWRP",
                    callback_data: "help|twrp"
                },
                {
                    text: "Meme",
                    callback_data: "help|meme"
                }
            ]);
        kb.inline_keyboard.push(
                [{
                text: "XDA",
                callback_data: "help|xda"
                }, {
                text: "Extra",
                callback_data: "help|extra"
                }]);
        kb.inline_keyboard.push(
                    [{
                text: "ROMs",
                callback_data: "help|roms"
                    }, {
                text: "Magisk",
                callback_data: "help|magisk"
                    }]);
        kb.inline_keyboard.push(
                        [{
                text: "ADB/Fastboot",
                callback_data: "help|adb"
                        }, {
                text: "microG",
                callback_data: "help|microg"
                        }]);
        kb.inline_keyboard.push(
                        [{
                text: "Firmwares",
                callback_data: "help|firmware"
                        }]);
        if ($.message.from.id == $.message.chat.id) {
            tg.api.sendMessage($.message.from.id, "Menu", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
        } else {
            //tg.api.sendMessage($.message.chat.id, "Check PM for help", {
            //    parse_mode: "markdown",
            //reply_markup: JSON.stringify(kb),
            //    reply_to_message_id: $.message.messageId
            //});
        }
    }

    get routes() {
        return {
            'startHandler': 'help',
            'helpHandler': 'help'
        }
    }
}

module.exports = StartController;
