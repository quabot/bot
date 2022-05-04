const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "emojiUpdate",
    async execute(oldEmoji, newEmoji, client, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldEmoji.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldEmoji.guild.id,
                        guildName: oldEmoji.guild.name,
                        logChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        levelEnabled: false,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        roleEnabled: false,
                        mainRole: "Member",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            oldEmoji.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === false) return;
            const channel = oldEmoji.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;

            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor("YELLOW")
                        .setTitle("Emoji Updated!")
                        .addField('Old Name', `${oldEmoji.name}`, true)
                        .addField('New Name', `${newEmoji.name}`, true)
                        .setFooter(`ID: ${newEmoji.id}`, `${newEmoji.url}`)
                ]
            });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}