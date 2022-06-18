const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "unban",
    description: "Unban a user.",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user-id",
            description: "User-ID of the user to unban.",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction, color) {
        try {

            let userid = interaction.options.getString('user-id');

            let member = await interaction.guild.bans.fetch(userid).catch(err => {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`That user doesn't exist/isn't banned!`)
                            .setColor(color)
                    ]
                }).catch(( err => { } ))
                return;
            });

            interaction.guild.members.unban(userid).catch(err => {
                if (error.code !== 50035) {
                    console.log(err);
                }
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Unbanned!`)
                        .setDescription(`**User:** <@${userid}>`)
                        .setColor(color)
                ]
            }).catch(( err => { } ));

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
                        ticketCategory: "none",
                        ticketClosedCategory: "none",
                        ticketEnabled: true,
                        ticketStaffPing: true,
                        ticketTopicButton: true,
                        ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        leaveChannelID: "none",
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
                        membersChannel: "none",
                        membersMessage: "Members: {count}",
                        memberEnabled: true
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
                            .setTitle("Member Unbanned")
                            .addFields(
                                { name: "Member", value: `<@${userid}>`, inline: true },
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