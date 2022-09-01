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
    joinVarMsg = joinVarMsg.replaceAll("{avatar}", `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`);

    return joinVarMsg;
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

    // convert

    return permission;
}

module.exports = { isValidHttpUrl, joinVariables, randomString, permissionBitToString };