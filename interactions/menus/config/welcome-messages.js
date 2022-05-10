const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    value: "welcome_messages",
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
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
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

        let joinMessage = guildDatabase.joinMessage;
        joinMessage = joinMessage.replace("{user}", `${interaction.user}`);
        joinMessage = joinMessage.replace("{username}", `${interaction.user.username}`);
        joinMessage = joinMessage.replace("{discriminator}", `${interaction.user.discriminator}`);
        joinMessage = joinMessage.replace("{guildname}", `${interaction.guild.name}`);
        joinMessage = joinMessage.replace("{guild}", `${interaction.guild.name}`);
        joinMessage = joinMessage.replace("{members}", `${interaction.guild.memberCount}`);
        joinMessage = joinMessage.replace("{membercount}", `${interaction.guild.memberCount}`);

        let leaveMessage = guildDatabase.leaveMessage;
        leaveMessage = leaveMessage.replace("{user}", `${interaction.user}`);
        leaveMessage = leaveMessage.replace("{username}", `${interaction.user.username}`);
        leaveMessage = leaveMessage.replace("{discriminator}", `${interaction.user.discriminator}`);
        leaveMessage = leaveMessage.replace("{guildname}", `${interaction.guild.name}`);
        leaveMessage = leaveMessage.replace("{guild}", `${interaction.guild.name}`);
        leaveMessage = leaveMessage.replace("{members}", `${interaction.guild.memberCount}`);
        leaveMessage = leaveMessage.replace("{membercount}", `${interaction.guild.memberCount}`);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Welcome Messages`)
                    .setDescription(`Change the welcome messages and leave messages that get sent on users leaves & joins. **Change** join and leave messages or **Toggle** these messages being sent in embeds.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: "Welcome Message", value: `${joinMessage}`, inline: true },
                        { name: "Leave Message", value: `${leaveMessage}`, inline: true },
                        { name: "Embed Enabled", value: `${guildDatabase.welcomeEmbed}`, inline: true }
                    )
                    .setColor(color)
            ], ephemeral: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'PRIMARY',
                            label: 'Change Join Message',
                            customId: "welcome_messages_join"
                        }),
                        new MessageButton({
                            style: 'SECONDARY',
                            label: 'Change Leave Message',
                            customId: "welcome_messages_leave"
                        }),
                        new MessageButton({
                            style: 'SUCCESS',
                            label: 'Enable Embed',
                            customId: "welcome_messages_enable"
                        }),
                        new MessageButton({
                            style: 'DANGER',
                            label: 'Disable Embed',
                            customId: "welcome_messages_disable"
                        }),
                    ]
                })
            ]
        });
    }
}