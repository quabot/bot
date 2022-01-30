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

            const buttonsCrimeDis = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId(`pickpocket-${interaction.user.id}`)
                        .setLabel('Pickpocket')
                        .setDisabled(true)
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`murder-${interaction.user.id}`)
                        .setLabel('Murder')
                        .setDisabled(true)
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`robbery-${interaction.user.id}`)
                        .setLabel('Robbery')
                        .setDisabled(true)
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`fraud-${interaction.user.id}`)
                        .setLabel('Fraud')
                        .setDisabled(true)
                        .setStyle('PRIMARY'),
                    new discord.MessageButton()
                        .setCustomId(`cancel-crime-${interaction.user.id}`)
                        .setLabel('Abort')
                        .setDisabled(true)
                        .setStyle('DANGER'),
                );

            if (interaction.isButton()) {
                const userId = interaction.user.id;
                const UserEco = require('../../schemas/UserEcoSchema');
                const UserEcoDatabase = await UserEco.findOne({
                    userId: interaction.user.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: interaction.user.id,
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
                        const addedEmbed = new discord.MessageEmbed().setColor(colors.COLOR).setDescription("You can use economy commands now.")
                        return interaction.channel.send({ embeds: [addedEmbed] });
                    }
                });
                if (interaction.customId === `lottery-${userId}`) {
                    let moneyGiven = 0;
                    let moneySpent = 500;

                    const buttonsLotteryDis = new discord.MessageActionRow()
                        .addComponents(
                            new discord.MessageButton()
                                .setCustomId(`lottery-${interaction.user.id}`)
                                .setLabel('Continue')
                                .setDisabled(true)
                                .setStyle('SUCCESS'),
                            new discord.MessageButton()
                                .setCustomId(`disable-lottery-${interaction.user.id}`)
                                .setLabel('Abort')
                                .setDisabled(true)
                                .setStyle('DANGER'),
                        );
                    interaction.update({ components: [buttonsLotteryDis] });

                    if (UserEcoDatabase.lastLottery !== undefined) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastLottery / 1000;
                        if (difference < 3600) {
                            let nextTime = parseInt(UserEcoDatabase.lastLottery) + 3600000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`ur on cooldown boi`)
                                .setColor(colors.COLOR)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to play again!`)
                            interaction.channel.send({ embeds: [notValid] });
                            return;
                        }
                    }

                    let yes = Math.random();
                    if (yes > 0.6) moneyGiven = 10000;
                    if (yes > 0.6) {
                        const embed = new discord.MessageEmbed()
                            .setTitle("You won the lottery: ⑩ 10,000")
                            .setDescription("Play again in 1h.")
                            .setColor(colors.LIME)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => {
                            return;
                        });
                    } else if (yes < 0.6) {
                        const embed = new discord.MessageEmbed()
                            .setTitle("you lost loser")
                            .setDescription("After spending ⑩ 500 you didn't win!")
                            .setColor(colors.RED)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => {
                            return;
                        });
                    }

                    let spaceAdd = moneyGiven / 40;

                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven - moneySpent,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastLottery: new Date().getTime(),
                    });
                    return;
                } else if (interaction.customId === `disable-lottery-${userId}`) {
                    const buttonsLotteryDis = new discord.MessageActionRow()
                        .addComponents(
                            new discord.MessageButton()
                                .setCustomId(`lottery-${interaction.user.id}`)
                                .setLabel('Continue')
                                .setDisabled(true)
                                .setStyle('SUCCESS'),
                            new discord.MessageButton()
                                .setCustomId(`disable-lottery-${interaction.user.id}`)
                                .setLabel('Abort')
                                .setDisabled(true)
                                .setStyle('DANGER'),
                        );
                    interaction.update({ components: [buttonsLotteryDis] });
                    return;
                } else if (interaction.customId === `pickpocket-${userId}`) {
                    interaction.update({ components: [buttonsCrimeDis] });
                    if (UserEcoDatabase.lastCrime) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastCrime / 1000;
                        if (difference < 180) {
                            let nextTime = parseInt(UserEcoDatabase.lastCrime) + 180000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`You are on cooldown!`)
                                .setColor(colors.COLOR)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to commit crimes again!`)
                            interaction.channel.send({ embeds: [notValid] });
                            return;
                        }
                    }
                    let yes = Math.random();
                    let randomMoneyWon = Math.random() * 700;
                    randomMoneyWon = Math.round(randomMoneyWon)
                    let randomMoneyLost = Math.random() * 400;
                    randomMoneyLost = Math.round(randomMoneyLost)
                    let moneyLost = 0;
                    let moneyGiven = 0;
                    if (yes > 0.4) moneyGiven = randomMoneyWon;
                    if (yes < 0.4) moneyLost = randomMoneyLost;
                    if (yes > 0.4) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`You pickpocketed someone and got ⑩ ${randomMoneyWon}`)
                            .setDescription("wow you're so succesfull")
                            .setColor(colors.LIME)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] });
                    } else if (yes < 0.4) {
                        const embed = new discord.MessageEmbed()
                            .setTitle("You got caught!")
                            .setDescription(`you had to pay ⑩ ${randomMoneyLost} to get out of jail.`)
                            .setColor(colors.RED)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] });
                    }
                    let spaceAdd = moneyGiven / 40;
                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven - moneyLost,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastCrime: new Date().getTime(),
                    });

                    return;
                } else if (interaction.customId === `murder-${userId}`) {
                    interaction.update({ components: [buttonsCrimeDis] });

                    if (UserEcoDatabase.lastCrime) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastCrime / 1000;
                        if (difference < 180) {
                            let nextTime = parseInt(UserEcoDatabase.lastCrime) + 180000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`You are on cooldown!`)
                                .setColor(colors.COLOR)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to commit crimes again!`)
                            interaction.channel.send({ embeds: [notValid] });
                            return;
                        }
                    }

                    let yes = Math.random();
                    let randomMoneyWon = Math.random() * 1000 + 100;
                    randomMoneyWon = Math.round(randomMoneyWon)
                    let randomMoneyLost = Math.random() * 500;
                    randomMoneyLost = Math.round(randomMoneyLost)
                    let moneyLost = 0;
                    let moneyGiven = 0;
                    if (yes > 0.5) moneyGiven = randomMoneyWon;
                    if (yes < 0.5) moneyLost = randomMoneyLost;
                    let victim = interaction.guild.members.cache.random();
                    if (yes > 0.5) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`You murdered ${victim.user.username}#${victim.user.discriminator}`)
                            .setDescription(`As a reward for killing them you recieved ⑩ ${randomMoneyWon}!`)
                            .setColor(colors.LIME)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] });
                    } else if (yes < 0.5) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Your attempt to murder ${victim.user.username}#${victim.user.discriminator} failed!`)
                            .setDescription(`You had to pay ⑩ ${randomMoneyLost} to get out of jail.`)
                            .setColor(colors.RED)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] });
                    }
                    let spaceAdd = moneyGiven / 40;
                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven - moneyLost,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastCrime: new Date().getTime(),
                    });

                    return;
                } else if (interaction.customId === `robbery-${userId}`) {
                    interaction.update({ components: [buttonsCrimeDis] });

                    if (UserEcoDatabase.lastCrime) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastCrime / 1000;
                        if (difference < 180) {
                            let nextTime = parseInt(UserEcoDatabase.lastCrime) + 180000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`You are on cooldown!`)
                                .setColor(colors.COLOR)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to commit crimes again!`)
                            interaction.channel.send({ embeds: [notValid] });
                            return;
                        }
                    }

                    let yes = Math.random();
                    let randomMoneyWon = Math.random() * 1500 + 100;
                    randomMoneyWon = randomMoneyWon + Math.random() * 500;
                    randomMoneyWon = randomMoneyWon / 2
                    randomMoneyWon = Math.round(randomMoneyWon)
                    let randomMoneyLost = Math.random() * 500;
                    randomMoneyLost = Math.round(randomMoneyLost)
                    let moneyLost = 0;
                    let moneyGiven = 0;
                    if (yes > 0.5) moneyGiven = randomMoneyWon;
                    if (yes < 0.5) moneyLost = randomMoneyLost;
                    const lostarray = ["the bank", "a tech store", "the grocery store", "ikea", "the gucci store", "the apple store"]
                    var victim = lostarray[Math.floor(Math.random() * lostarray.length)];
                    if (yes > 0.5) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`You robbed ${victim}!`)
                            .setDescription(`You took off with ⑩ ${randomMoneyWon}!`)
                            .setColor(colors.LIME)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] });
                    } else if (yes < 0.5) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Your attempt to rob ${victim} failed!`)
                            .setDescription(`You had to pay ⑩ ${randomMoneyLost} to get out of jail.`)
                            .setColor(colors.RED)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] });
                    }
                    let spaceAdd = moneyGiven / 40;
                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven - moneyLost,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastCrime: new Date().getTime(),
                    });

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