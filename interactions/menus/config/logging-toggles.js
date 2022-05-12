const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "logging_toggles",
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

        var mainCh = interaction.guild.channels.cache.get(`${guildDatabase.logChannelID}`);
        var modCh = interaction.guild.channels.cache.get(`${guildDatabase.punishmentChannelID}`);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Logging Toggles`)
                    .setDescription(`Toggle the logging in mod log channels, main log channels and more. \n**Enable** or **Disable** logging for both types of channels with the buttons below this message.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Mod Logs", value: `${guildDatabase.logEnabled}`, inline: true },
                        { name: "Main Logs", value: `${guildDatabase.modEnabled}`, inline: true }
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable Main',
                            customId: "logging_toggles_main_on"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable Main',
                            customId: "logging_toggles_main_off"
                        }),
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable Mod',
                            customId: "logging_toggles_mod_on"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable Mod',
                            customId: "logging_toggles_mod_off"
                        }),
                    ]
                })
            ]
        });
    }
}