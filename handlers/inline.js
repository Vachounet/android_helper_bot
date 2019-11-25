const Telegram = require('telegram-node-bot')
const TelegramBaseInlineQueryController = Telegram.TelegramBaseInlineQueryController;
const request = require("request")

class InlineController extends TelegramBaseInlineQueryController {
    /**
     * @param {Scope} $
     */
    handle($) {

        if (!$._inlineQuery._query || $._inlineQuery._query === "") {
            return
        }

        var articles = [];

        var keyword = $._inlineQuery._query.split(" ").join("-");
        var parent = this;

        BotUtils.getJSON("https://gifer.com/api/search/media?q=" + keyword + "&limit=20&", function (json) {
            json.forEach(function (gifResult) {
                articles.push({
                    type: "gif",
                    id: Math.random().toString(36).substring(7),
                    gif_url: "https://i.gifer.com/embedded/download/" + gifResult._id + ".gif",
                    gif_width: gifResult.width,
                    gif_height: gifResult.height,
                    thumb_url: "https://i.gifer.com/fetch/w100-preview/" + gifResult.file.path + ".gif"
                })
            })

            $.answer(articles, "{cache_time: 0}")
        })
    }
}

module.exports = InlineController;
