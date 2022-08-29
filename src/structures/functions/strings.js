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

    return joinVarMsg;
}

module.exports = { isValidHttpUrl, joinVariables };