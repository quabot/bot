const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "welcome_toggles",
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
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
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

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Welcome Toggles`)
                    .setDescription(`Toggle welcome messages, leave messages, both at the samee timee or just one with the buttons below. **Enable** or **Disable** welcome & leave messages.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Welcome", value: `${guildDatabase.welcomeEnabled.replace("false", "Disabled").replace("true", "Enabled")}`, inline: true },
                        { name: "Leave", value: `${guildDatabase.leaveEnabled.replace("false", "Disabled").replace("true", "Enabled")}`, inline: true },
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable Welcome',
                            customId: "welcome_messages_welcome_on"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable Welcome',
                            customId: "welcome_messages_welcome_off"
                        }),
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable Leave',
                            customId: "welcome_messages_leave_on"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable Leave',
                            customId: "welcome_messages_leave_off"
                        }),
                    ]
                })
            ]
        });
    }
}