const botConfig = {
    db: {
        host: 'localhost',
        port: 27017,
        name: 'test'
    },
    token: '',
    api_id: 0000,
    api_hash: '0000',
    enableTdlib: false,
    github_token: '',
    dump_feature_enabled: false,
    dump_sudoers: [],
    commands_type: {
        ROMS: "ROMs",
        RECOVERY: "Recovery",
        APP: "Applications",
        FIRMWARE: "Firmwares",
        TTOLS: "Tools",
        XDA: "XDA",
        GITHUB:"GitHub",
        XPOSED:"XPosed",
        MAGISK:"Magisk",
        NANODROID:"NanoDroid",
        DEVELOPERS:"Developers"
    }
};

module.exports = botConfig;
