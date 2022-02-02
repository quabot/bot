const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton
} = require('discord.js')

const colors = require('../../files/colors.json')
const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');
const { deleteConfirm } = require('../../files/interactions/tickets');

module.exports = {
    name: 'delete',
    description: 'Delete a ticket.',
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
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
                            levelEnabled: false,
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

            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

            const deleteEmbed = new MessageEmbed()
                .setTitle("Delete ticket")
                .setDescription("Are you sure you want to delete this ticket?")
                .setColor(colors.COLOR)
                .setTimestamp()
            interaction.reply({ embeds: [deleteEmbed], components: [deleteConfirm] })

        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
            return
        }
    }
}