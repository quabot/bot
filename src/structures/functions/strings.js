function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
}

function joinVariables(text, member) {
    const joinVarMsg = text
        .replaceAll('{user}', member)
        .replaceAll('{username}', member.user.username)
        .replaceAll('{tag}', member.user.tag)
        .replaceAll('{discriminator}', member.user.discriminator)
        .replaceAll('{guild}', member.guild.name)
        .replaceAll('{members}', member.guild.memberCount)
        .replaceAll('{id}', member.user.id)
        .replaceAll('{avatarhash}', member.user.avatar)
        .replaceAll('{avatar}', `${member.user.displayAvatarURL({ dynamic: false })}`);

    return joinVarMsg;
}

function levelVariables(text, member, level, xp, message) {
    const levelVarMsg = text
        .replaceAll('{user}', member)
        .replaceAll('{username}', member.user.username)
        .replaceAll('{tag}', member.user.tag)
        .replaceAll('{discriminator}', member.user.discriminator)
        .replaceAll('{guild}', member.guild.name)
        .replaceAll('{members}', member.guild.memberCount)
        .replaceAll('{id}', member.user.id)
        .replaceAll('{xp}', xp)
        .replaceAll('{msg}', message.url)
        .replaceAll('{required}', (parseInt(level) + 1) * 400 + 100)
        .replaceAll('{channel}', message.channel)
        .replaceAll('{level}', level)
        .replaceAll('{avatarhash}', member.user.avatar)
        .replaceAll('{avatar}', `${member.user.displayAvatarURL({ dynamic: false })}`);

    return levelVarMsg;
}

function randomString() {
    // Credits for the code to: https://github.com/Joasss/NeoPass/
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789!@#$%^&*!@#$%^&*!@#$%^&*';

    let tempString = '';
    for (let i = 0; i < 8; i++) {
        const rndChar = charSet.charAt(Math.floor(Math.random() * charSet.length));
        tempString = tempString + rndChar;
    }

    return tempString;
}

function permissionBitToString(permission) {
    const perms = [
        { perm: 'CREATE_INSTANT_INVITE', code: 0x00000001 },
        { perm: 'KICK_MEMBERS', code: 0x00000002 },
        { perm: 'BAN_MEMBERS', code: 0x00000004 },
        { perm: 'TIMEOUT_MEMBERS', code: parseInt(1099511627776n) },
        { perm: 'ADMINISTRATOR', code: 0x00000008 },
        { perm: 'MANAGE_CHANNELS', code: 0x00000010 },
        { perm: 'MANAGE_GUILD', code: 0x00000020 },
        { perm: 'ADD_REACTIONS', code: 0x00000040 },
        { perm: 'VIEW_AUDIT_LOG', code: 0x00000080 },
        { perm: 'VIEW_CHANNEL', code: 0x00000400 },
        { perm: 'SEND_MESSAGES', code: 0x00000800 },
        { perm: 'SEND_TTS_MESSAGES', code: 0x00001000 },
        { perm: 'MANAGE_MESSAGES', code: 0x00002000 },
        { perm: 'EMBED_LINKS', code: 0x00004000 },
        { perm: 'ATTACH_FILES', code: 0x00008000 },
        { perm: 'READ_MESSAGE_HISTORY', code: 0x00010000 },
        { perm: 'MENTION_EVERYONE', code: 0x00020000 },
        { perm: 'USE_EXTERNAL_EMOJIS', code: 0x00040000 },
        { perm: 'CONNECT', code: 0x00100000 },
        { perm: 'SPEAK', code: 0x00200000 },
        { perm: 'MUTE_MEMBERS', code: 0x00400000 },
        { perm: 'DEAFEN_MEMBERS', code: 0x00800000 },
        { perm: 'MOVE_MEMBERS', code: 0x01000000 },
        { perm: 'USE_VAD', code: 0x02000000 },
        { perm: 'CHANGE_NICKNAME', code: 0x04000000 },
        { perm: 'MANAGE_NICKNAMES', code: 0x08000000 },
        { perm: 'MANAGE_ROLES', code: 0x10000000 },
        { perm: 'MANAGE_WEBHOOKS', code: 0x20000000 },
        { perm: 'MANAGE_EMOJIS', code: 0x40000000 },
    ];

    let permissionString;

    try {
        permissionString = perms.find(i => i.code === parseInt(permission)).perm;
    } catch (e) {}
    return permissionString;
}

function titleCase(str) {
    const splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

module.exports = { titleCase, levelVariables, isValidHttpUrl, joinVariables, randomString, permissionBitToString };
