const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "general_suggestions",
    permission: "ADMINISTRATOR",
    async execute(interaction, client, color) {

        const Guild = require('../../../structures/schemas/GuildSchema');
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
                        message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!guildDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Added this server to the database, please run that command again.`)
            ]
        }).catch((err => { }));

        var channel = interaction.guild.channels.cache.get(`${guildDatabase.suggestChannelID}`);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Suggestions`)
                    .setDescription(`Allow users to leave suggestions, that will be sent to a channel you can choose. Users can vote and it gives them a way to express their ideas.\n**Enable** this, **Disable** this or **Change** the channel with the buttons below this message.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Channel", value: `${channel}`, inline: true },
                        { name: "Enabled/Disabled", value: `${guildDatabase.suggestEnabled.replace("false", "Disabled").replace("true", "Enabled")}`, inline: true }
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'PRIMARY',
                            label: 'Change',
                            customId: "general_suggestions_channel"
                        }),
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable',
                            customId: "general_suggestions_enable"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable',
                            customId: "general_suggestions_disable"
                        }),
                    ]
                })
            ]
        });
    }
}