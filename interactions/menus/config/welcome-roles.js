const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "welcome_roles",
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

        const role = interaction.guild.roles.cache.get(`${guildDatabase.mainRole}`);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Welcome Roles`)
                    .setDescription(`When a user joins your server, they need a role. Give users roles on join with this module.\n**Enable**, **Disable** or **Change** the role with the buttons below this message.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Enabled/Disabled", value: `${guildDatabase.roleEnabled.replace("false", "Disabled").replace("true", "Enabled")}`, inline: true },
                        { name: "Role", value: `${role}`, inline: true },
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'PRIMARY',
                            label: 'Set',
                            customId: "welcome_roles_set"
                        }),
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable',
                            customId: "welcome_roles_on"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable',
                            customId: "welcome_roles_off"
                        }),
                    ]
                })
            ]
        });
    }
}