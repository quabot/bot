const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    name: "guildMemberRemove",
    async execute(member, client, color) {
        try {
            // DM & Bot checks
            if (!member.guild) return;

            // Find the guild's database
            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: member.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: member.guild.id,
                        guildName: member.guild.name,
                        logChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        roleEnabled: false,
                        mainRole: "none",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;

            if (guildDatabase.leaveEnabled === "false") return;

            const channel = member.guild.channels.cache.get(`${guildDatabase.welcomeChannelID}`);

            let leaveMessage = guildDatabase.leaveMessage;
            leaveMessage = leaveMessage.replace("{user}", `${member}`);
            leaveMessage = leaveMessage.replace("{username}", `${member.user.username}`);
            leaveMessage = leaveMessage.replace("{discriminator}", `${member.user.discriminator}`);
            leaveMessage = leaveMessage.replace("{guildname}", `${member.guild.name}`);
            leaveMessage = leaveMessage.replace("{guild}", `${member.guild.name}`);
            leaveMessage = leaveMessage.replace("{members}", `${member.guild.memberCount}`);
            leaveMessage = leaveMessage.replace("{membercount}", `${member.guild.memberCount}`);

            if (guildDatabase.welcomeEmbed === "true") {
                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(`RED`)
                            .setTimestamp()
                            .setTitle('Member left!')
                            .setAuthor(`${member.user.tag} left!`, member.user.avatarURL())
                            .setDescription(`${leaveMessage}`)
                    ]
                }).catch((err => { }));
            } else {
                channel.send(`${leaveMessage}`).catch((err => { }));
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}