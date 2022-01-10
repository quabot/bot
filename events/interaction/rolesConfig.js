const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { noPermission, timedOut } = require('../../files/embeds/config')
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema')
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id
            },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            logChannelID: 'none',
                            reportChannelID: 'none',
                            suggestChannelID: 'none',
                            welcomeChannelID: 'none',
                            levelChannelID: 'none',
                            pollChannelID: 'none',
                            ticketCategory: 'Tickets',
                            closedTicketCategory: 'Tickets',
                            logEnabled: true,
                            musicEnabled: true,
                            levelEnabled: true,
                            reportEnabled: true,
                            suggestEnabled: true,
                            ticketEnabled: true,
                            welcomeEnabled: true,
                            pollsEnabled: true,
                            roleEnabled: true,
                            mainRole: 'Member',
                            mutedRole: 'Muted'
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            if (interaction.isSelectMenu()) {
                const filter = m => interaction.user === author;
                const collector = interaction.channel.createMessageCollector({ time: 15000 });

                if (interaction.values[0] === "main_role") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });

                    const mainRole = new MessageEmbed()
                        .setTitle("Change Main Role name")
                        .setDescription("Enter the new name within 15 seconds to change it.")
                        .addField("Current value", `${guildDatabase.mainRole}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    interaction.reply({ embeds: [mainRole], ephemeral: true });

                    collector.on('collect', async m => {
                        if (m) {
                            if (m.author.bot) return;
                            if (m.content.length > 25) return;
                            await guildDatabase.updateOne({
                                mainRole: m.content
                            });

                            const updated = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed main role name to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated] })
                            collector.stop();

                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }
            };
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}