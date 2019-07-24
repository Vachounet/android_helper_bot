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
                    text: "NanoDroid",
                    callback_data: "help|nanodroid"
                }
            ]);
        kb.inline_keyboard.push(
                [{
                text: "XDA",
                callback_data: "help|xda"
                }, {
                text: "GitHub",
                callback_data: "help|github"
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
                        }, {
                text: "GSI",
                callback_data: "help|gsi"
                        }]);
        kb.inline_keyboard.push(
                        [{
                text: "Direct Link Generator",
                callback_data: "help|directlinks"
                        }, {
                text: "CAF",
                callback_data: "help|caf"
                        }]);
        kb.inline_keyboard.push(
                        [{
                text: "Devices Infos",
                callback_data: "help|deviceinfos"
                        }, {
                text: "CleanAPK",
                callback_data: "help|cleanapk"
                        }]);
        if ($.message.from.id === $.message.chat.id) {
            tg.api.sendMessage($.message.from.id, "Menu", {
                parse_mode: "markdown",
                reply_markup: JSON.stringify(kb),
                reply_to_message_id: $.message.messageId
            });
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
