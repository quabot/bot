const { MessageEmbed, MessageAttachment } = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
    name: "guildMemberAdd",
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
                        mainRole: "Member",
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

            if (guildDatabase.welcomeEnabled === "false") return;

            const channel = member.guild.channels.cache.get(`${guildDatabase.welcomeChannelID}`);

            let joinMessage = guildDatabase.joinMessage;
            joinMessage = joinMessage.replace("{user}", `${member}`);
            joinMessage = joinMessage.replace("{username}", `${member.username}`);
            joinMessage = joinMessage.replace("{discriminator}", `${member.discriminator}`);
            joinMessage = joinMessage.replace("{guildname}", `${member.guild.name}`);
            joinMessage = joinMessage.replace("{guild}", `${member.guild.name}`);
            joinMessage = joinMessage.replace("{members}", `${member.guild.memberCount}`);
            joinMessage = joinMessage.replace("{membercount}", `${member.guild.memberCount}`);

            if (guildDatabase.welcomeEmbed === "true") {
                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(`GREEN`)
                            .setTimestamp()
                            .setTitle('Member joined!')
                            .setAuthor(`${member.user.tag} just joined!`, member.user.avatarURL())
                            .setDescription(`${joinMessage}`)
                    ]
                }).catch((err => { }));
            } else {
                channel.send(`${joinMessage}`).catch((err => { }));
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}