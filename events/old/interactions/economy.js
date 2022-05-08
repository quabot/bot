const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const discord = require('discord.js')
const shop = require('../../files/shop.json');

const { COLOR_MAIN } = require('../../files/colors.json');
const { added, error } = require('../../embeds/general');

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
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
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
                                interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                            });
                        const addedEmbed = new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("You can use economy commands now.")
                        return interaction.channel.send({ embeds: [addedEmbed] }).catch(err => console.log(err));
                    }
                }).clone().catch(function (err) { console.log(err) });

                if (interaction.customId === "page1next") {
                    interaction.reply({ ephemeral: true, content: "More shop items coming soon." }).catch(err => console.log("error w page1next"))
                }
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
                    interaction.update({ components: [buttonsLotteryDis] }).catch(err => console.log(err));

                    if (UserEcoDatabase.lastLottery !== undefined) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastLottery / 1000;
                        if (difference < 1800) {
                            let nextTime = parseInt(UserEcoDatabase.lastLottery) + 1800000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`ur on cooldown boi`)
                                .setColor(COLOR_MAIN)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to play again!`)
                            interaction.channel.send({ embeds: [notValid] }).catch(err => console.log(err));
                            return;
                        }
                    }

                    const array = UserEcoDatabase.shop;
                    const appleArray = array.find(item => item.name === `Apple`);
                    const appleShop = shop.find(item => item.item === `Apple`);

                    if (array) {
                        if (appleArray) {
                            if (appleArray.lastUsed) {
                                let timeinonehour = appleArray.lastUsed + appleShop.active;
                                if (new Date().getTime() < timeinonehour) {
                                    let yes = Math.random();
                                    if (yes > 0.6) moneyGiven = 10500;
                                    if (yes > 0.6) {
                                        const embed = new discord.MessageEmbed()
                                            .setTitle("You won the lottery: ⑩ 10,500")
                                            .setDescription("Play again in 1h.")
                                            .setFooter("5% boost active from 🍎 Apple")
                                            .setColor(`GREEN`)
                                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                                    } else if (yes < 0.6) {
                                        const embed = new discord.MessageEmbed()
                                            .setTitle("you lost loser")
                                            .setDescription("After spending ⑩ 500 you didn't win!")
                                            .setColor(`RED`)
                                            .setFooter("5% boost active from 🍎 Apple")
                                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                                    }
                                    return;
                                }
                            }
                        }

                    }

                    let yes = Math.random();
                    if (yes > 0.6) moneyGiven = 10000;
                    if (yes > 0.6) {
                        const embed = new discord.MessageEmbed()
                            .setTitle("You won the lottery: ⑩ 10,000")
                            .setDescription("Play again in 1h.")
                            .setColor(`GREEN`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                    } else if (yes < 0.6) {
                        const embed = new discord.MessageEmbed()
                            .setTitle("you lost loser")
                            .setDescription("After spending ⑩ 500 you didn't win!")
                            .setColor(`RED`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                    }

                    let spaceAdd = moneyGiven / 40;

                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven - moneySpent,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastLottery: new Date().getTime(),
                    });
                    return;
                }

                if (interaction.customId === `disable-lottery-${userId}`) {
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
                    interaction.update({ components: [buttonsLotteryDis] }).catch(err => console.log(err));
                    return;
                }

                if (interaction.customId === `pickpocket-${userId}`) {
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
                                .setColor(COLOR_MAIN)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to commit crimes again!`)
                            interaction.channel.send({ embeds: [notValid] }).catch(err => console.log(err));
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
                            .setColor(`GREEN`)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                    } else if (yes < 0.4) {
                        const embed = new discord.MessageEmbed()
                            .setTitle("You got caught!")
                            .setDescription(`you had to pay ⑩ ${randomMoneyLost} to get out of jail.`)
                            .setColor(`RED`)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                    }
                    let spaceAdd = moneyGiven / 40;
                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven - moneyLost,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastCrime: new Date().getTime(),
                    });

                    return;
                }

                if (interaction.customId === `murder-${userId}`) {
                    interaction.update({ components: [buttonsCrimeDis] }).catch(err => console.log(err));

                    if (UserEcoDatabase.lastCrime) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastCrime / 1000;
                        if (difference < 180) {
                            let nextTime = parseInt(UserEcoDatabase.lastCrime) + 180000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`You are on cooldown!`)
                                .setColor(COLOR_MAIN)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to commit crimes again!`)
                            interaction.channel.send({ embeds: [notValid] }).catch(err => console.log(err));
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
                            .setColor(`GREEN`)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                    } else if (yes < 0.5) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Your attempt to murder ${victim.user.username}#${victim.user.discriminator} failed!`)
                            .setDescription(`You had to pay ⑩ ${randomMoneyLost} to get out of jail.`)
                            .setColor(`RED`)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                    }
                    let spaceAdd = moneyGiven / 40;
                    await UserEcoDatabase.updateOne({
                        outWallet: UserEcoDatabase.outWallet + moneyGiven - moneyLost,
                        walletSize: UserEcoDatabase.walletSize + spaceAdd,
                        lastCrime: new Date().getTime(),
                    });

                    return;
                }

                if (interaction.customId === `robbery-${userId}`) {
                    interaction.update({ components: [buttonsCrimeDis] }).catch(err => console.log(err));

                    if (UserEcoDatabase.lastCrime) {
                        let difference = new Date().getTime() / 1000 - UserEcoDatabase.lastCrime / 1000;
                        if (difference < 180) {
                            let nextTime = parseInt(UserEcoDatabase.lastCrime) + 180000;
                            var timestamp = nextTime - new Date().getTime();
                            var date = new Date(timestamp);
                            const timeLeft = date.getMinutes() + " minutes and " + date.getSeconds() + " seconds";
                            const notValid = new discord.MessageEmbed()
                                .setTitle(`You are on cooldown!`)
                                .setColor(COLOR_MAIN)
                                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                                .setDescription(`Wait **${timeLeft}** to commit crimes again!`)
                            interaction.channel.send({ embeds: [notValid] }).catch(err => console.log(err));
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
                            .setColor(`GREEN`)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
                    } else if (yes < 0.5) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Your attempt to rob ${victim} failed!`)
                            .setDescription(`You had to pay ⑩ ${randomMoneyLost} to get out of jail.`)
                            .setColor(`RED`)
                            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`)
                        interaction.channel.send({ embeds: [embed] }).catch(err => console.log(err));
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

            if (interaction.isSelectMenu()) {
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
                                interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                            });
                        const addedEmbed = new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("You can use economy commands now.")
                        return interaction.channel.send({ embeds: [addedEmbed] }).catch(err => console.log(err));
                    }
                }).clone().catch(function (err) { console.log(err) });
                if (interaction.values[0] === `shop0`) {

                    if (UserEcoDatabase.outWallet < parseInt(shop[0].prize)) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`No money!`)
                            .setDescription(`You need \`⑩ ${shop[0].prize}\` to buy **${shop[0].emoji} ${shop[0].item}**!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                        return;
                    }

                    const array = UserEcoDatabase.shop;
                    if (array) {
                        const item = array.find(item => item.name === `${shop[0].item}`);
                        if (item) {
                            if (item.count + 1 > shop[0].max) {
                                const embed = new discord.MessageEmbed()
                                    .setTitle(`Too many!`)
                                    .setDescription(`You can only purchase \`${shop[0].max}\` of **${shop[0].emoji} ${shop[0].item}**!`)
                                    .setColor(COLOR_MAIN)
                                    
                                interaction.reply({ ephemeral: true, embeds: [embed] });
                                return;

                            }
                            const updatedArray = array.map(item => {
                                if (item.name === `${shop[0].item}`) {
                                    return { ...item, count: item.count + 1 }
                                }

                                return item;
                            });
                            await UserEcoDatabase.updateOne({
                                shop: updatedArray,
                                outWallet: UserEcoDatabase.outWallet - shop[0].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[0].emoji} ${shop[0].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[0].prize}\`!\nYou now have \`${item.count + 1}\` of **${shop[0].emoji} ${shop[0].item}**!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        } else {
                            array.push(
                                {
                                    id: "2",
                                    name: `${shop[0].item}`,
                                    count: 1,
                                }
                            )

                            await UserEcoDatabase.updateOne({
                                shop: array,
                                outWallet: UserEcoDatabase.outWallet - shop[0].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[0].emoji} ${shop[0].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[0].prize}\`!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        }
                    } else {
                        const array = [
                            {
                                id: "2",
                                name: `${shop[0].item}`,
                                count: 1,
                            }
                        ]

                        await UserEcoDatabase.updateOne({
                            shop: array,
                            outWallet: UserEcoDatabase.outWallet - shop[0].prize,
                        });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Bought 1x ${shop[0].emoji} ${shop[0].item}`)
                            .setDescription(`This transaction cost you \`⑩ ${shop[0].prize}\`!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                    }

                }

                if (interaction.values[0] === `shop1`) {

                    if (UserEcoDatabase.outWallet < parseInt(shop[1].prize)) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`No money!`)
                            .setDescription(`You need \`⑩ ${shop[1].prize}\` to buy **${shop[1].emoji} ${shop[1].item}**!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                        return;
                    }

                    const array = UserEcoDatabase.shop;
                    if (array) {
                        const item = array.find(item => item.name === `${shop[1].item}`);
                        if (item) {
                            const updatedArray = array.map(item => {
                                if (item.name === `${shop[1].item}`) {
                                    return { ...item, count: item.count + 1 }
                                }

                                return item;
                            });

                            if (item.count + 1 > shop[1].max) {
                                const embed = new discord.MessageEmbed()
                                    .setTitle(`Too many!`)
                                    .setDescription(`You can only purchase \`${shop[1].max}\` of **${shop[1].emoji} ${shop[1].item}**!`)
                                    .setColor(COLOR_MAIN)
                                    
                                interaction.reply({ ephemeral: true, embeds: [embed] });
                                return;

                            }

                            await UserEcoDatabase.updateOne({
                                shop: updatedArray,
                                outWallet: UserEcoDatabase.outWallet - shop[1].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[1].emoji} ${shop[1].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[1].prize}\`!\nYou now have \`${item.count + 1}\` of **${shop[1].emoji} ${shop[1].item}**!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        } else {
                            array.push(
                                {
                                    id: "2",
                                    name: `${shop[1].item}`,
                                    count: 1,
                                }
                            )

                            await UserEcoDatabase.updateOne({
                                shop: array,
                                outWallet: UserEcoDatabase.outWallet - shop[1].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[1].emoji} ${shop[1].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[1].prize}\`!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        }
                    } else {
                        const array = [
                            {
                                id: "2",
                                name: `${shop[1].item}`,
                                count: 1,
                            }
                        ]

                        await UserEcoDatabase.updateOne({
                            shop: array,
                            outWallet: UserEcoDatabase.outWallet - shop[1].prize,
                        });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Bought 1x ${shop[1].emoji} ${shop[1].item}`)
                            .setDescription(`This transaction cost you \`⑩ ${shop[1].prize}\`!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                    }
                }

                if (interaction.values[0] === `shop2`) {

                    if (UserEcoDatabase.outWallet < parseInt(shop[2].prize)) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`No money!`)
                            .setDescription(`You need \`⑩ ${shop[2].prize}\` to buy **${shop[2].emoji} ${shop[2].item}**!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                        return;
                    }

                    const array = UserEcoDatabase.shop;
                    if (array) {
                        const item = array.find(item => item.name === `${shop[2].item}`);
                        if (item) {
                            const updatedArray = array.map(item => {
                                if (item.name === `${shop[2].item}`) {
                                    return { ...item, count: item.count + 1 }
                                }

                                return item;
                            });

                            if (item.count + 1 > shop[2].max) {
                                const embed = new discord.MessageEmbed()
                                    .setTitle(`Too many!`)
                                    .setDescription(`You can only purchase \`${shop[2].max}\` of **${shop[2].emoji} ${shop[2].item}**!`)
                                    .setColor(COLOR_MAIN)
                                    
                                interaction.reply({ ephemeral: true, embeds: [embed] });
                                return;

                            }

                            await UserEcoDatabase.updateOne({
                                shop: updatedArray,
                                outWallet: UserEcoDatabase.outWallet - shop[2].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[2].emoji} ${shop[2].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[2].prize}\`!\nYou now have \`${item.count + 1}\` of **${shop[2].emoji} ${shop[2].item}**!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        } else {
                            array.push(
                                {
                                    id: "2",
                                    name: `${shop[2].item}`,
                                    count: 1,
                                }
                            )

                            await UserEcoDatabase.updateOne({
                                shop: array,
                                outWallet: UserEcoDatabase.outWallet - shop[2].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[2].emoji} ${shop[2].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[2].prize}\`!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        }
                    } else {
                        const array = [
                            {
                                id: "2",
                                name: `${shop[2].item}`,
                                count: 1,
                            }
                        ]

                        await UserEcoDatabase.updateOne({
                            shop: array,
                            outWallet: UserEcoDatabase.outWallet - shop[2].prize,
                        });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Bought 1x ${shop[2].emoji} ${shop[2].item}`)
                            .setDescription(`This transaction cost you \`⑩ ${shop[2].prize}\`!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                    }
                }

                if (interaction.values[0] === `shop3`) {

                    if (UserEcoDatabase.outWallet < parseInt(shop[3].prize)) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`No money!`)
                            .setDescription(`You need \`⑩ ${shop[3].prize}\` to buy **${shop[3].emoji} ${shop[3].item}**!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                        return;
                    }

                    const array = UserEcoDatabase.shop;
                    if (array) {
                        const item = array.find(item => item.name === `${shop[3].item}`);
                        if (item) {
                            const updatedArray = array.map(item => {
                                if (item.name === `${shop[3].item}`) {
                                    return { ...item, count: item.count + 1 }
                                }

                                return item;
                            });

                            if (item.count + 1 > shop[3].max) {
                                const embed = new discord.MessageEmbed()
                                    .setTitle(`Too many!`)
                                    .setDescription(`You can only purchase \`${shop[3].max}\` of **${shop[3].emoji} ${shop[3].item}**!`)
                                    .setColor(COLOR_MAIN)
                                    
                                interaction.reply({ ephemeral: true, embeds: [embed] });
                                return;

                            }

                            await UserEcoDatabase.updateOne({
                                shop: updatedArray,
                                outWallet: UserEcoDatabase.outWallet - shop[3].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[3].emoji} ${shop[3].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[3].prize}\`!\nYou now have \`${item.count + 1}\` of **${shop[3].emoji} ${shop[3].item}**!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        } else {
                            array.push(
                                {
                                    id: "2",
                                    name: `${shop[3].item}`,
                                    count: 1,
                                }
                            )

                            await UserEcoDatabase.updateOne({
                                shop: array,
                                outWallet: UserEcoDatabase.outWallet - shop[3].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[3].emoji} ${shop[3].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[3].prize}\`!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        }
                    } else {
                        const array = [
                            {
                                id: "2",
                                name: `${shop[3].item}`,
                                count: 1,
                            }
                        ]

                        await UserEcoDatabase.updateOne({
                            shop: array,
                            outWallet: UserEcoDatabase.outWallet - shop[3].prize,
                        });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Bought 1x ${shop[3].emoji} ${shop[3].item}`)
                            .setDescription(`This transaction cost you \`⑩ ${shop[3].prize}\`!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                    }
                }

                if (interaction.values[0] === `shop4`) {

                    if (UserEcoDatabase.outWallet < parseInt(shop[4].prize)) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(`No money!`)
                            .setDescription(`You need \`⑩ ${shop[4].prize}\` to buy **${shop[4].emoji} ${shop[4].item}**!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                        return;
                    }

                    const array = UserEcoDatabase.shop;
                    if (array) {
                        const item = array.find(item => item.name === `${shop[4].item}`);
                        if (item) {
                            const updatedArray = array.map(item => {
                                if (item.name === `${shop[4].item}`) {
                                    return { ...item, count: item.count + 1 }
                                }

                                return item;
                            });

                            if (item.count + 1 > shop[4].max) {
                                const embed = new discord.MessageEmbed()
                                    .setTitle(`Too many!`)
                                    .setDescription(`You can only purchase \`${shop[4].max}\` of **${shop[4].emoji} ${shop[4].item}**!`)
                                    .setColor(COLOR_MAIN)
                                    
                                interaction.reply({ ephemeral: true, embeds: [embed] });
                                return;

                            }

                            await UserEcoDatabase.updateOne({
                                shop: updatedArray,
                                outWallet: UserEcoDatabase.outWallet - shop[4].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[4].emoji} ${shop[4].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[4].prize}\`!\nYou now have \`${item.count + 1}\` of **${shop[4].emoji} ${shop[4].item}**!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        } else {
                            array.push(
                                {
                                    id: "2",
                                    name: `${shop[4].item}`,
                                    count: 1,
                                }
                            )

                            await UserEcoDatabase.updateOne({
                                shop: array,
                                outWallet: UserEcoDatabase.outWallet - shop[4].prize,
                            });
                            const embed = new discord.MessageEmbed()
                                .setTitle(`Bought 1x ${shop[4].emoji} ${shop[4].item}`)
                                .setDescription(`This transaction cost you \`⑩ ${shop[4].prize}\`!`)
                                .setColor(COLOR_MAIN)
                                
                            interaction.reply({ ephemeral: true, embeds: [embed] });
                        }
                    } else {
                        const array = [
                            {
                                id: "2",
                                name: `${shop[4].item}`,
                                count: 1,
                            }
                        ]

                        await UserEcoDatabase.updateOne({
                            shop: array,
                            outWallet: UserEcoDatabase.outWallet - shop[4].prize,
                        });
                        const embed = new discord.MessageEmbed()
                            .setTitle(`Bought 1x ${shop[4].emoji} ${shop[4].item}`)
                            .setDescription(`This transaction cost you \`⑩ ${shop[4].prize}\`!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ ephemeral: true, embeds: [embed] });
                    }
                }
            }

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [error] });
            return;
        }
    }
}