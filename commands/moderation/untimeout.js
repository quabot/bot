const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "untimeout",
    description: "Untimeout a user.",
    permission: "MODERATE_MEMBERS",
    options: [
        {
            name: "user",
            description: "User to unmute.",
            type: "USER",
            required: true,
        },
    ],
    async execute(client, interaction, color) {
        try {

            let member = interaction.options.getMember('user');

            if (!member) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a member to remove the timeout from.`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`You cannot remove a timeout from someone with a role higher than yours!`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Your timeout was removed.`)
                        .setDescription(`Your timeout was removed on one of your servers, **${interaction.guild.name}**.
                        **Timed out removed by:** ${interaction.user}`)
                        .setTimestamp()
                        .setColor(color)
                ]
            }).catch(err => { if (err.code !== 50007) console.log(err) });

            member.timeout(1, `${reason}`).catch(err => {
                if (err.code === 50013) return interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`I do not have permission to removet the timeout from that user.`)
                            .setColor(color)
                    ]
                }).catch((err => { }))
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Timeout Removed!`)
                        .setDescription(`**User:** ${member}`)
                        .setColor(color)
                ]
            }).catch((err => { }))

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        modEnabled: true,
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
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (guildDatabase.modEnabled === "false") return;
            const channel = interaction.guild.channels.cache.get(`${guildDatabase.punishmentChannelID}`);

            if (channel.type !== "GUILD_TEXT" || channel.type !== "GUILD_NEWS")

                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("Member Untimedout")
                            .addFields(
                                { name: "Member", value: `${member}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                                { name: "Staff", value: `${interaction.user}`, inline: true },
                                { name: "Channel", value: `${interaction.channel}`, inline: true },
                                { name: "\u200b", value: "\u200b", inline: true },
                            )
                            .setTimestamp()
                            .setFooter({ text: `Command: /${this.name}` })
                    ]
                }).catch((err => { }));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}