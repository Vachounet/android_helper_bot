const {
    Client
} = require('tdl')
const {
    TDLib
} = require('tdl-tdlib-ffi')
var exec = require('child_process').exec;
var fs = require('fs');
var archiver = require('archiver');
const config = require('./config')

const tdlClient = new Client(new TDLib(), {
    apiId: config.api_id,
    apiHash: config.api_hash,
    verbosityLevel: 1,
    tdlibParameters: {
        use_message_database: true,
        use_secret_chats: false,
        system_language_code: 'en',
        application_version: '1.0',
        device_model: 'android',
        system_version: 'nodejs',
        enable_storage_optimizer: true,
        use_chat_info_database: true,
        use_file_database: true
    }
})
tdlClient.on('update', async update => {
    //console.log(update)
    //return
    if (update.last_message && update.chat_id === update.last_message.sender_user_id && update.last_message.content) {
        if (update.last_message.content["_"] && update.last_message.content["_"] === "messageDocument") {
            if (update.last_message.content.document.mime_type === "application/vnd.android.package-archive") {
                const result = await tdlClient.invoke({
                    _: 'downloadFile',
                    file_id: update.last_message.content.document.document.id,
                    priority: 1,
                    offset: 0,
                    limit: 0,
                    synchronous: true
                })

                exec("java -jar " + __dirname + "/apks/apktool.jar d " + result.local.path + " -o " + __dirname + "/apks/" + update.last_message.content.document.file_name + " -kf", function callback(error, stdout, stderr) {
                    var output = fs.createWriteStream(__dirname + "/apks/" + update.last_message.content.document.file_name + ".zip");
                    var archive = archiver('zip', {
                        zlib: {
                            level: 5
                        }
                    });

                    archive.pipe(output);
                    archive.directory(__dirname + "/apks/" + update.last_message.content.document.file_name, update.last_message.content.document.file_name);

                    archive.on('error', function (err) {
                        console.log(err);
                    });

                    output.on('close', async function () {
                        await tdlClient.invoke({
                            _: 'sendMessage',
                            chat_id: update.last_message.chat_id,
                            input_message_content: {
                                _: 'inputMessageDocument',
                                document: {
                                    _: 'inputFileLocal',
                                    path: __dirname + "/apks/" + update.last_message.content.document.file_name + ".zip"
                                }
                            }
                        })
                    });

                    output.on('end', function () {
                        console.log('Data has been drained');
                    });

                    archive.finalize();
                });
            } else if (update.last_message.content.document.mime_type === "application/x-raw-disk-image") {
                const result = await tdlClient.invoke({
                    _: 'downloadFile',
                    file_id: update.last_message.content.document.document.id,
                    priority: 1,
                    offset: 0,
                    limit: 0,
                    synchronous: true
                })

                exec(__dirname + "/unpack/unpackimg.sh --nosudo " + result.local.path, function callback(error, stdout, stderr) {
                    var output = fs.createWriteStream(__dirname + "/unpack/" + update.last_message.content.document.file_name + ".zip");
                    var archive = archiver('zip', {
                        zlib: {
                            level: 5
                        }
                    });

                    archive.pipe(output);
                    archive.directory(__dirname + "/unpack/" + update.last_message.content.document.file_name + "f", update.last_message.content.document.file_name);

                    archive.on('error', function (err) {
                        console.log(err);
                    });

                    output.on('close', async function () {
                        await tdlClient.invoke({
                            _: 'sendMessage',
                            chat_id: update.last_message.chat_id,
                            input_message_content: {
                                _: 'inputMessageDocument',
                                document: {
                                    _: 'inputFileLocal',
                                    path: __dirname + "/unpack/" + update.last_message.content.document.file_name + ".zip"
                                }
                            }
                        })
                    });

                    output.on('end', function () {
                        console.log('Data has been drained');
                    });

                    archive.finalize();
                })
            }
        }
    }
})
tdlClient.on('error', console.error)
tdlClient.setLogFatalErrorCallback(
    errorMessage => console.error('Fatal error:', errorMessage)
)

class tdlib {

    async init() {
        await tdlClient.connectAndLogin(() => ({
            type: 'bot',
            getToken: retry => retry ?
                Promise.reject('Token is not valid') : Promise.resolve(config.token) // Token from @BotFather
        }))
    }
}

module.exports = tdlib;
