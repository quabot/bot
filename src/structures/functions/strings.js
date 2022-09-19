const { PermissionsBitField } = require("discord.js");

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function joinVariables(text, member) {
    let joinVarMsg = text;

    joinVarMsg = joinVarMsg.replaceAll("{user}", member);
    joinVarMsg = joinVarMsg.replaceAll("{username}", member.user.username);
    joinVarMsg = joinVarMsg.replaceAll("{tag}", member.user.tag);
    joinVarMsg = joinVarMsg.replaceAll("{discriminator}", member.user.discriminator);
    joinVarMsg = joinVarMsg.replaceAll("{guild}", member.guild.name);
    joinVarMsg = joinVarMsg.replaceAll("{members}", member.guild.memberCount);
    joinVarMsg = joinVarMsg.replaceAll("{id}", member.user.id);
    joinVarMsg = joinVarMsg.replaceAll("{avatarhash}", member.user.avatar);
    joinVarMsg = joinVarMsg.replaceAll("{avatar}", `${member.user.displayAvatarURL({ dynamic: false })}`);

    return joinVarMsg;
}

function levelVariables(text, member, level, xp) {
    let levelVarMsg = text;

    levelVarMsg = levelVarMsg.replaceAll("{user}", member);
    levelVarMsg = levelVarMsg.replaceAll("{username}", member.user.username);
    levelVarMsg = levelVarMsg.replaceAll("{tag}", member.user.tag);
    levelVarMsg = levelVarMsg.replaceAll("{discriminator}", member.user.discriminator);
    levelVarMsg = levelVarMsg.replaceAll("{guild}", member.guild.name);
    levelVarMsg = levelVarMsg.replaceAll("{members}", member.guild.memberCount);
    levelVarMsg = levelVarMsg.replaceAll("{id}", member.user.id);
    levelVarMsg = levelVarMsg.replaceAll("{xp}", xp);
    levelVarMsg = levelVarMsg.replaceAll("{level}", level);
    levelVarMsg = levelVarMsg.replaceAll("{avatarhash}", member.user.avatar);
    levelVarMsg = levelVarMsg.replaceAll("{avatar}", `${member.user.displayAvatarURL({ dynamic: false })}`);

    return levelVarMsg;
}

function randomString() {

    // Credits for the code to: https://github.com/Joasss/NeoPass/
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789!@#$%^&*!@#$%^&*!@#$%^&*";

    let tempString = "";
    for (let i = 0; i < 8; i++) {
        const rndChar = charSet.charAt(Math.floor(Math.random() * charSet.length));
        tempString = tempString + rndChar;
    }

    return tempString;
}

function permissionBitToString(permission) {

    const perms = [
        { perm: "CREATE_INSTANT_INVITE", code: 0x00000001 },
        { perm: "KICK_MEMBERS", code: 0x00000002 },
        { perm: "BAN_MEMBERS", code: 0x00000004 },
        { perm: "TIMEOUT_MEMBERS", code: parseInt(1099511627776n) },
        { perm: "ADMINISTRATOR", code: 0x00000008 },
        { perm: "MANAGE_CHANNELS", code: 0x00000010 },
        { perm: "MANAGE_GUILD", code: 0x00000020 },
        { perm: "ADD_REACTIONS", code: 0x00000040 },
        { perm: "VIEW_AUDIT_LOG", code: 0x00000080 },
        { perm: "VIEW_CHANNEL", code: 0x00000400 },
        { perm: "SEND_MESSAGES", code: 0x00000800 },
        { perm: "SEND_TTS_MESSAGES", code: 0x00001000 },
        { perm: "MANAGE_MESSAGES", code: 0x00002000 },
        { perm: "EMBED_LINKS", code: 0x00004000 },
        { perm: "ATTACH_FILES", code: 0x00008000 },
        { perm: "READ_MESSAGE_HISTORY", code: 0x00010000 },
        { perm: "MENTION_EVERYONE", code: 0x00020000 },
        { perm: "USE_EXTERNAL_EMOJIS", code: 0x00040000 },
        { perm: "CONNECT", code: 0x00100000 },
        { perm: "SPEAK", code: 0x00200000 },
        { perm: "MUTE_MEMBERS", code: 0x00400000 },
        { perm: "DEAFEN_MEMBERS", code: 0x00800000 },
        { perm: "MOVE_MEMBERS", code: 0x01000000 },
        { perm: "USE_VAD", code: 0x02000000 },
        { perm: "CHANGE_NICKNAME", code: 0x04000000 },
        { perm: "MANAGE_NICKNAMES", code: 0x08000000 },
        { perm: "MANAGE_ROLES", code: 0x10000000 },
        { perm: "MANAGE_WEBHOOKS", code: 0x20000000 },
        { perm: "MANAGE_EMOJIS", code: 0x40000000 }
    ]

    try {
        perms.find(i => i.code === parseInt(permission)).perm
    } catch (e) { }
    return perms.find(i => i.code === parseInt(permission)).perm;
}

module.exports = { levelVariables, isValidHttpUrl, joinVariables, randomString, permissionBitToString };