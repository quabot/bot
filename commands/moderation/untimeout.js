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
            }).catch(err => console.log(err));

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
                }).catch(err => console.log(err));
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Timeout Removed!`)
                        .setDescription(`**User:** ${member}`)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

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
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        logEnabled: true,
                        levelEnabled: false,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        roleEnabled: false,
                        mainRole: "Member",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}