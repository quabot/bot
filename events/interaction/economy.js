const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const discord = require('discord.js')
const { createTranscript } = require('discord-html-transcripts');

const colors = require('../../files/colors.json');
const { noPermission } = require('../../files/embeds/config');
const { addedDatabase, errorMain } = require('../../files/embeds.js');

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
                            mutedRole: 'Muted',
                            joinMessage: "Welcome {user} to **{guild-name}**!",
                            swearEnabled: false,
                            transcriptChannelID: "none"
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            if (interaction.isButton()) {
                const userId = interaction.user.id;
                if (interaction.customId === `lottery-${userId}`) {
                    const UserEco = require('../../schemas/UserEcoSchema');
                    const UserEcoDatabase = await UserEco.findOne({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id
                    }, (err, usereco) => {
                        if (err) console.error(err);
                        if (!usereco) {
                            const newEco = new UserEco({
                                userId: interaction.user.id,
                                guildId: interaction.guild.id,
                                guildName: mesinteractionsage.guild.name,
                                outWallet: 0,
                                walletSize: 500,
                                inWallet: 0,
                                lastUsed: "none"
                            });
                            newEco.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [errorMain] });
                                });
                            return interaction.channel.send("You were added to the database! Please add users on messageCreate next time.")
                        }
                    });
                    let moneyGiven = 0;
                    let moneySpent = 0;



                    /// script


                    
                    let spaceAdd = moneyGiven / 40;

                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastLottery: new Date().getTime(),
                    });
                    return;
                } else if (interaction.customId === `disable-lottery-${userId}`) {
                    interaction.update("Lottery disabled.");
                    return;
                } else {
                    interaction.reply({ ephemeral: true, content: "You cannot use that." });
                    return;
                }
            }

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}