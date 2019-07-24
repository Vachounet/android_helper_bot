const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')
var requestPromise = require("request-promise")

const BaseURL = "https://api.cleanapk.org/apps?"
const ListHomeAction = "action=list_home"
const SearchAction = "action=search&keyword="
const DownloadAction = "action=download&app_id="

class CleanAPKController extends TelegramBaseController {

    search($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /apk search keywords", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }
        var keywords = $.message.text.replace("/apk search ", "")
        BotUtils.getJSON(BaseURL + SearchAction + keywords.trim(), async function (json, err) {

            if (json && json.success && json.apps.length > 0) {

                var message = ""
                var i = 0;
                for (let app of json.apps) {
                    var dlURL = BaseURL + DownloadAction + app._id
                    var dlInfos;
                    try {
                        dlInfos = await requestPromise.get(dlURL)
                    } catch (e) {
                        continue
                    }
                    dlInfos = JSON.parse(dlInfos);
                    if (dlInfos && dlInfos.success) {
                        message += "<a href='" + dlInfos.download_data.eelo_download_link + "'>" + app.name + " by " + app.author + "</a>\n"
                    }
                    if (i++ > 10)
                        break;
                }

                $.sendMessage(message, {
                    parse_mode: "html",
                    reply_to_message_id: $.message.messageId
                });
            } else {
                $.sendMessage("No result matching your query", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        })
    }

    discover($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /apk discover", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        BotUtils.getJSON(BaseURL + ListHomeAction, async function (json, err) {
            if (json && json.success) {

                var message = ""

                for (let app of json.home.discover) {
                    var dlURL = BaseURL + DownloadAction + app._id
                    var dlInfos = await requestPromise.get(dlURL)
                    dlInfos = JSON.parse(dlInfos);
                    if (dlInfos && dlInfos.success) {
                        message += "[" + app.name + "](" + dlInfos.download_data.eelo_download_link + ")\n"
                    }
                }

                $.sendMessage(message, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        })
    }

    popular($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /apk popular", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        BotUtils.getJSON(BaseURL + ListHomeAction, async function (json, err) {
            if (json && json.success) {

                var message = ""

                for (let app of json.home.popular_apps_in_last_24_hours) {
                    var dlURL = BaseURL + DownloadAction + app._id
                    var dlInfos = await requestPromise.get(dlURL)
                    dlInfos = JSON.parse(dlInfos);
                    if (dlInfos && dlInfos.success) {
                        message += "[" + app.name + "](" + dlInfos.download_data.eelo_download_link + ")\n"
                    }
                }

                $.sendMessage(message, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        })
    }

    top($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /apk top", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }
        BotUtils.getJSON(BaseURL + ListHomeAction, async function (json, err) {
            if (json && json.success) {

                var message = ""

                for (let app of json.home.top_updated_apps) {
                    var dlURL = BaseURL + DownloadAction + app._id
                    var dlInfos = await requestPromise.get(dlURL)
                    dlInfos = JSON.parse(dlInfos);
                    if (dlInfos && dlInfos.success) {
                        message += "[" + app.name + "](" + dlInfos.download_data.eelo_download_link + ")\n"
                    }
                }

                $.sendMessage(message, {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
            }
        })
    }

    get routes() {
        return {
            'searchApkHandler': 'search',
            'discoverApkHandler': 'discover',
            'topApkHandler': 'top',
            'popularApkHandler': 'popular',
        }
    }
}



module.exports = CleanAPKController;
