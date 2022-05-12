const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "messageCreate",
    async execute(message, client, color) {
        try {

            if (message.channel.type !== "DM") return;
            if (message.author.bot) return;

            message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setTitle("Hello!")
                        .setTimestamp()
                        .setThumbnail(client.user.avatarURL({ dynamic: true }))
                        .setDescription("I'm QuaBot, a multipurpose bot with Music, Reaction Roles, moderation and a lot more! You can check my commands [here](https://quabot.net/commands) and invite me [here](https://discord.com/oauth2/authorize?client_id=845603702210953246&permissions=275384757342&scope=bot%20applications.commands)!")
                ], allowedMentions: { repliedUser: false },
            })

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}