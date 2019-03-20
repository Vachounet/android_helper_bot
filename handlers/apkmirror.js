const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const HTTP = require('https')
const JSDOM = require('jsdom');

class APKMirrorController extends TelegramBaseController {

    search($) {
        var command = $.message.text.replace("/am search", "").split(" ");

        var package_name = "";

        for (var t = 0; t < command.length; t++) {
            if (command[t].trim() !== "")
                package_name += command[t] + " ";
        }

        package_name = package_name.trim();
        var msg = "";
        var kb = {
            inline_keyboard: []
        };
        try {

            package_name = encodeURIComponent(package_name);

            HTTP.get("https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=" + package_name, function (response) {

                var body = "";

                response.on('data', function (chunk) {
                    body += chunk;
                });

                response.on('end', function () {
                    var status = response.statusCode;

                    if (body) {
                        var dom = new JSDOM.JSDOM(body);
                        msg += "🔍 *Apps Search Result(s):*"
                        var apps = dom.window.document.querySelectorAll("#content .appRow");

                        if (!apps || apps.length === 0) {
                            $.sendMessage("🔍 *No results found matching your query*", {
                                parse_mode: "markdown",
                                reply_markup: JSON.stringify(kb)
                            });
                            return;
                        }

                        for (var i = 0; i < apps.length; i++) {

                            var appExists = false;
                            for (var t = 0; t < kb.inline_keyboard.length; t++) {

                                if (kb.inline_keyboard[t] && kb.inline_keyboard[t][0].text) {
                                    var splitAppName = kb.inline_keyboard[t][0].text.split(" ")[0]
                                    if (apps[i].querySelector("a").textContent.split(" ")[0].indexOf(splitAppName) !== -1) {
                                        appExists = true;
                                        break;
                                    }
                                }
                            }

                            if (!appExists && apps[i].querySelector("a").textContent !== "Next >") {

                                var title = apps[i].querySelector("a").textContent;
                                var link = apps[i].querySelector("a").href;

                                kb.inline_keyboard.push(
                                [{
                                        text: title,
                                        url: "https://www.apkmirror.com" + link
                                }]);
                            }
                        }
                    } else {
                        msg += "*App not found*";
                    }

                    $.sendMessage(msg, {
                        parse_mode: "markdown",
                        reply_markup: JSON.stringify(kb)
                    });

                });
            });

        } catch (error) {

            msg += "*App not found*";
            $.sendMessage(msg, {
                parse_mode: "markdown"
            });
            return;
        }

    }

    get routes() {
        return {
            'searchHandler': 'search'
        }
    }
}

module.exports = APKMirrorController;
