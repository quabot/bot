const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');

const noAmountMsg = new discord.MessageEmbed()
    .setDescription(":question: Please enter an amount of messages to be cleared!")
    .setColor(colors.COLOR)
const msg200Max = new discord.MessageEmbed()
    .setDescription(":1234: Please enter a number between 0-200!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription(":x: I cannot delete messages older than 14 days!")
    .setColor(colors.COLOR)
const { addedDatabase } = require('../../files/embeds');

module.exports = {
    name: "clear",
    description: "Clear a number of messages.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "amount",
            description: "Amount of messages",
            type: "INTEGER",
            required: true,
        },
    ],
    async execute(client, interaction) {

        try {
            let amount = interaction.options.getInteger('amount');
            if (!amount) return interaction.reply({ embeds: [noAmountMsg] });
            if (amount <= 0) amount = 1;
            if (amount >= 201) amount = 200;

            interaction.channel.bulkDelete(amount).catch(err => interaction.channel.send({ embeds: [errorMain] })).then(msg => { setTimeout(() => msg.delete(), 6000) });
            const clearedAmount = new discord.MessageEmbed()
                .setDescription(`:white_check_mark: Succesfully cleared **${amount}** messages!`)
                .setColor(colors.COLOR)
            interaction.reply({ embeds: [clearedAmount] });

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
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed = new discord.MessageEmbed()
                    .setColor(colors.CLEAR_COLOR)
                    .setTitle('Messages Cleared')
                    .addField('Channel', `${interaction.channel}`)
                    .addField('Amount', `${amount}`)
                logChannel.send({ embeds: [embed] });
            } else {
                return;
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}