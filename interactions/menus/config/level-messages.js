const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "level_messages",
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
                        logPollChannelID: "none",
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

        var embed = `${guildDatabase.levelEmbed}`;

        let levelMessage = `${guildDatabase.levelMessage}`;
        levelMessage = levelMessage.replace("{user}", `${interaction.user}`);
        levelMessage = levelMessage.replace("{username}", `${interaction.user.username}`);
        levelMessage = levelMessage.replace("{discriminator}", `${interaction.user.discriminator}`);
        levelMessage = levelMessage.replace("{level}", `3`);
        levelMessage = levelMessage.replace("{xp}", `0`);
        levelMessage = levelMessage.replace("{guild}", `${interaction.guild.name}`);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Level Messages`)
                    .setDescription(`Set the message that will be sent when a user level-ups, make it be in an embed or not. **Change** or **Reset** the message and **Enable** or **Disable** the embed with the buttons below this message.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Message", value: `${levelMessage}`, inline: true },
                        { name: "Embed", value: `${embed.replace("false", "Disabled").replace("true", "Enabled")}`, inline: true }
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'PRIMARY',
                            label: 'Change',
                            customId: "level_messages_change"
                        }),
                        new MessageButton({
                            style: 'SECONDARY',
                            label: 'Reset',
                            customId: "level_messages_reset"
                        }),
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable Embed',
                            customId: "level_messages_embed_on"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable Embed',
                            customId: "level_messages_embed_off"
                        }),
                    ]
                })
            ]
        });
    }
}