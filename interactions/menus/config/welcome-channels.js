const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "welcome_channels",
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

        var welcomeCh = interaction.guild.channels.cache.get(`${guildDatabase.welcomeChannelID}`);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Welcome Channels`)
                    .setDescription(`Change the welcome channel where join and leave messages will be sent.\n**Change** or **Reset** the welcome channel with the buttons below this message.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Welcome Channel", value: `${welcomeCh}`, inline: true },
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'PRIMARY',
                            label: 'Change',
                            customId: "welcome_channels_set"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Reset',
                            customId: "welcome_channels_reset"
                        }),
                    ]
                })
            ]
        });
    }
}