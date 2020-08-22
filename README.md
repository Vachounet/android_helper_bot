# **android_helper_bot**

# **Usage details**
**[here](https://vachounet.github.io/android_helper_bot/)**

# **Install**
## Host packages
*aria2, pq, jk, mongodb*

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
 },mongoimport --db test --collection fdroid --file index-v1.json
 token: '', //Your bot token
};

module.exports = botConfig;
```

## **Import F-Droid DB :**

```bash
wget https://f-droid.org/repo/index-v1.jar
unzip index-v1.jar
node import_fdroid.js
```
