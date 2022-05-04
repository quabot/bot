const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { noPermission, timedOut } = require('../../embeds/config');
const { error, added } = require('../../embeds/general.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });
    
            if (interaction.isSelectMenu()) {
                const filter = m => interaction.user === author;
                const collector = interaction.channel.createMessageCollector({ time: 15000 });

                if (interaction.values[0] === "main_role") {
                    if (!guildDatabase) return;
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));

                    const mainRole = new MessageEmbed()
                        .setTitle("Change Main Role name")
                        .setDescription("Mention the new role within 15 seconds to change it.")
                        .addField("Current value", `<${guildDatabase.mainRole}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    interaction.reply({ embeds: [mainRole], ephemeral: true }).catch(err => console.log(err));

                    collector.on('collect', async m => {
                        if (m) {
                            if (m.author.bot) return;
                            if (m.content.length > 25) return;
                            const role = m.mentions.roles.first();
                            await guildDatabase.updateOne({
                                mainRole: role.id
                            });

                            const updated = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed main role to ${role}!`)
                                .setColor(COLOR_MAIN)
                            m.channel.send({ embeds: [updated] }).catch(err => console.log(err));
                            collector.stop();

                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] }).catch(err => console.log(err));
                        }
                    });
                }
            };
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log(err));
            return;
        }
    }
}