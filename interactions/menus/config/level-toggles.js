const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "level_toggles",
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

        var card = `${guildDatabase.levelCard}`;

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Level Toggles`)
                    .setDescription(`Enable levels or make the bot use a rank card. **Enable** or **Disable** levels or **Enable** or **Disable** the rank-card with the buttons below this message.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Levels", value: `${guildDatabase.levelEnabled.replace("false", "Disabled").replace("true", "Enabled")}`, inline: true },
                        { name: "Rank Card", value: `${card.replace("false", "Disabled").replace("true", "Enabled")}`, inline: true }
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'PRIMARY',
                            label: 'Enable Levels',
                            customId: "level_toggles_level_on"
                        }),
                        new MessageButton({
                            style: 'SECONDARY',
                            label: 'Disable Levels',
                            customId: "level_toggles_level_off"
                        }),
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable Rank Card',
                            customId: "level_toggles_card_on"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable Rank Card',
                            customId: "level_toggles_card_off"
                        }),
                    ]
                })
            ]
        });
    }
}