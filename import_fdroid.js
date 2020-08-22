const fs = require('fs');
var mongojs = require('mongojs')
const config = require('config')
var db = mongojs(config.db.name || process.env.DBNAME)
var col = db.collection('fdroid')

fs.readFile('index-v1.json', function read(err, data) {
    if (err) {
        throw err;
    }

    col.remove();
    var json = JSON.parse(data)
    col.save(json.apps)
});
