# **android_helper_bot**

# **Usage details**
**[here](https://vachounet.github.io/android_helper_bot/)**

# **Install**
## Host packages
*aria2, pq, jk, mongodb*

## Python packages
gplaycli (https://github.com/matlink/gplaycli)

## libtdjson
Need to be built from sources on host (https://github.com/tdlib/td)
Copy libtdjson.so on bot root folder

## Node
```bash
npm install
mv config.ex.js config.js
```

**Update config.js accordingly (bot token and db infos)**

```javascript
const botConfig = {
 db: {
   host: 'localhost',
   port: 27017,
   name: 'test'
 },
 token: '', // Your bot token
 api_id: 0000, // from my.telegram.org
 api_hash: '0000', // from my.telegram.org
};

module.exports = botConfig;
```

## **Import F-Droid DB :**

```bash
wget https://f-droid.org/repo/index-v1.jar
unzip index-v1.jar
node import_fdroid.js
```
