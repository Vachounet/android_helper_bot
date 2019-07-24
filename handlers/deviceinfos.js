const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
var BotUtils = require("../utils.js")
var request = require("request")
const JSDOM = require('jsdom')

class DeviceInfosController extends TelegramBaseController {

    getDeviceInfos($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /deviceinfos device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];
        BotUtils.getJSON("https://raw.githubusercontent.com/androidtrackers/certified-android-devices/master/devices.json",
            function (json, err) {
                var deviceCount = json.length
                while (deviceCount--) {
                    if (json[deviceCount].device === device || json[deviceCount].model === device) {
                        var message = json[deviceCount].brand + " " + json[deviceCount].name + "\n"
                        message += "*Codename* : `" + json[deviceCount].device + "`\n"
                        message += "*Model* : `" + json[deviceCount].model + "`\n"
                        $.sendMessage(message, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                        break;
                    }
                }
            })

    }

    getDeviceFromCodename($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /codename brand device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var brand = $.command.arguments[0];
        var device = $.command.arguments[1];
        if ($.command.arguments.length > 2) {
            for (var i = 2; i < $.command.arguments.length; i++) {
                device += " " + $.command.arguments[i]
            }

            device = device.trim()
        }
        BotUtils.getJSON("https://raw.githubusercontent.com/androidtrackers/certified-android-devices/master/devices.json",
            function (json, err) {
                var deviceCount = json.length
                while (deviceCount--) {
                    if (json[deviceCount].brand.toLowerCase().includes(brand.toLowerCase()) &&
                        json[deviceCount].name.toLowerCase().includes(device.toLowerCase())) {
                        var message = json[deviceCount].brand + " " + json[deviceCount].name + "\n"
                        message += "*Codename* : `" + json[deviceCount].device + "`\n"
                        message += "*Model* : `" + json[deviceCount].model + "`\n"
                        $.sendMessage(message, {
                            parse_mode: "markdown",
                            reply_to_message_id: $.message.messageId
                        });
                        break;
                    }
                }
            })

    }

    getDeviceSpecs($) {
        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /specs brand device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }
        request.get("https://www.devicespecifications.com/en/brand-more", {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
            }
        }, function (error, response, body) {
            var dom = new JSDOM.JSDOM(body);

            var searchBrand = $.command.arguments[0]
            var device = $.command.arguments[1];
            if ($.command.arguments.length > 2) {
                for (var i = 2; i < $.command.arguments.length; i++) {
                    device += " " + $.command.arguments[i]
                }
                device = device.trim()
            }

            var brands = dom.window.document.querySelector(".brand-listing-container-news").querySelectorAll("a")
            var brandCount = brands.length;
            while (brandCount--) {
                if (brands[brandCount].textContent.toLowerCase().trim().includes(searchBrand.toLowerCase())) {
                    var devicesUrl = brands[brandCount].href;
                    request.get(devicesUrl, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                        }
                    }, function (error, response, body) {
                        dom = new JSDOM.JSDOM(body);
                        var models = dom.window.document.querySelectorAll("div[id*='model_'] h3");
                        for (var t = 0; t < models.length; t++) {
                            if (models[t].textContent.toLowerCase().trim().includes(device.toLowerCase())) {
                                var devicePage = models[t].children[0].href;
                                request.get(devicePage, {
                                    headers: {
                                        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
                                    }
                                }, function (error, response, body) {
                                    dom = new JSDOM.JSDOM(body);
                                    var description = dom.window.document.querySelector("#model-brief-specifications");

                                    var titles = description.innerHTML.match(new RegExp('<b>(.*?)</b>', 'gmi'))

                                    var message = "*" + dom.window.document.querySelector("header h1").textContent.trim() + "*\n\n"

                                    for (let title of titles) {
                                        var data = description.innerHTML.trim().split(title)[1].split("<br>")[0].split("<b>")[0]
                                        message += "*" + title.replace('<b>', '').replace('</b>', '') + "* " + data + "\n"
                                    }

                                    var imageUrl = dom.window.document.head.querySelector("meta[property='og:image']")

                                    $.sendPhoto({
                                        url: imageUrl.getAttribute("content")
                                    }, {
                                        parse_mode: "markdown",
                                        caption: message,
                                        reply_to_message_id: $.message.messageId
                                    })
                                })
                                break;
                            }
                        }
                    })
                    break;
                }
            }
        })
    }

    get routes() {
        return {
            'deviceInfosHandler': 'getDeviceInfos',
            'codenameHandler': 'getDeviceFromCodename',
            'deviceSpecsHandler': 'getDeviceSpecs',
        }
    }
}

module.exports = DeviceInfosController;
