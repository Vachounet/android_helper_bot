---
layout: default
title: Android Helper Bot
---

## Install

```bash
npm install
```

```bash
mv config.ex.js config.js
```

Update config.js accordingly (bot token and db infos)

```js
const botConfig = {
 db: {
   host: 'localhost',
   port: 27017,
   name: 'test'
 },
 token: '', //Your bot token
};

module.exports = botConfig;
```

## Features

### Direct Links Generator

Generate direct links for different sources

**Usage:** Paste downloadable links from supported source

Currently Supported:

* Google Drive
* Mega
* Android File Host a.k.a AFH
* Sourceforge
* Github Releases

### APKMirror

Search for apks on [APKMirror](https://www.apkmirror.com/)

> /am search _keywords_


### AndroidFileHost

Search for files on [AndroidFileHost](https://androidfilehost.com/)

> /afh search _keywords_


The bot can also provide direct links for file URL. It will automatically send mirrors.

> Ex.: https://androidfilehost.com/?fid=746010030569952951



### OpenGapps

Search for lastests OpenGapps packages (arm or arm64)
Provides nano, pico, mini and micro packages

> /gapps (get latests Android 9.0 arm64 packages)
>
> /gapps arm (get latests Android 9.0 arm packages)
>
> /gapps arm 8.0 (get latests Android 8.0 arm packages)


### Google Camera Mods

Search for Google Camera Mods from [celsoazevedo.com](https://www.celsoazevedo.com/files/android/google-camera/)

> /gcam (returns a list of available devs)
>
> /gcam _devname_ (get latests mods for given dev)


### TWRP

Search for official TWRP builds from [dl.twrp.me](https://dl.twrp.me/)

> /twrp _device_


### XDA

Get user details

> /xda user _username_

Get device forums

> /xda device _devicename_

Search for forums

> /xda forum _keywords_

Search for threads

> /xda thread _keywords_

Get latests portal news

> /xda news
>
> /xda news _vendorname_ (filter by vendor/OEM)

Get notified on new posts for a given thread

> /xda follow _threadid_ (add a thread)

> /xda follow rm _threadid_ (remove thread)

> /xda follow get (get list of followed threads)

Search for apps on XDA Labs

> /labs _keywords_


### ROMs

Get official builds for various ROMs

You can use the /filterrom command to allow one command only. Useful for ROMs groups.
> Ex.: /filterrom omni will block all other commands, only /omni will be allowed

Supported ROMs/commands : 
*   /aex (AOSPExtended)
*   /aicp (Android Ice Cold Project)
*   /aosip (Android Open Source illusion Project)
*   /arrow (ArrowOS)
*   /bootleg (Bootleggers)
*   /carbon (CarbonROM)
*   /cos (CosmicOS)
*   /cosp (Clean Open Source Project)
*   /crdroid (crDroidAndroid)
*   /dotos (dotOS)
*   /du (DirtyUnicorns)
*   /havoc (HavocOS)
*   /lineage (LineageOS)
*   /omni (OmniROM)
*   /pe (PixelExperience)
*   /pecaf (PixelExperience CAF Edition)
*   /pego (PixelExperience GO Edition)
*   /pixys (PixysOS)
*   /posp (Potato Open Source Project)
*   /revenge (RevengeOS)
*   /rr (Resurrectionremix)
*   /syberia (Syberia OS)
*   /viper (ViperOS)
*   /xtended (MSM Xtended)

> /_rom_ _devicecodename_
>
> Ex.: /crdroid whyred

### GSI

Search for Generic System Images from various devs

Currently supported GSI : [phh](https://forum.xda-developers.com/project-treble/trebleenabled-device-development/experimental-phh-treble-t3709659), [erfan](https://forum.xda-developers.com/project-treble/trebleenabled-device-development/pie-erfan-gsi-ports-t3906486) or [descendant](https://descendant.me/)

> /gsi phh
>
> /gsi erfan



### Magisk

Get latests [Magisk](https://forum.xda-developers.com/apps/magisk) packages (including flashble zip, uninstaller and MagiskManager APK)

> /magisk

### ADB/Fastboot

Get latest [SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools) package (mac, linux and windows)

> /adb
> or
> /fastboot

### microG

Get latests [microG](https://microg.org/) packages


### Stock Firmwares

Search for OFFICIAL OEM firmwares

Supported OEMs/commands 
* /moto ( Motorola )
* /op ( Oneplus )
* /xiaomi ( Xiaomi )
* /asus ( Asus )
* /huawei ( Huawei )

> Ex.: /moto harpia
>
>/xiaomi whyred

