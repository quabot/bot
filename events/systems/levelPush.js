let { messageArray } = require("../..");

module.exports = {
    name: "messageCreate",
    async execute(message, client, color) {

        if (message.author.bot) return;

        if (messageArray.find(item => item.userId === message.author.id && item.guildId === message.guild.id)) return;

        let obj = {
            content_length: message.content.length,
            guildId: message.guild.id,
            userId: message.author.id,
            channelId: message.channel.id
        };

        messageArray.push(obj);
    }
}
