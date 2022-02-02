const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const discord = require('discord.js')
const { createTranscript } = require('discord-html-transcripts');

const colors = require('../../files/colors.json');
const { noPerms } = require('../../files/embeds.js');
const { mainDisabled, stepOneToggle, stepOneDisabled, stepTwoToggle, stepTwoToggleDisabled, stepTwoToggleTwo, stepTwoToggleTwoDisabled, stepThreeTD, stepThreeT } = require('../../files/interactions/guildAdd');
const { addedDatabase, stepOne, stepTwo, stepOne2, stepOneTDisabled, stepTwoRoleToggle, stepTwoChannel, stepTwoRole, stepTwoTDisabled, stepThree, errorMain, stepToTDisabled, done, stepThreeMainCat } = require('../../files/embeds/guildAdd');

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
                            levelEnabled: false,
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
                if (interaction.customId === "botaddstart") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [mainDisabled] });
                    interaction.channel.send({ embeds: [stepOne], components: [stepOneToggle] })
                }
                if (interaction.customId === "botaddoneenable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [stepOneDisabled] });
                    await guildDatabase.updateOne({
                        logEnabled: true
                    });
                    interaction.channel.send({ embeds: [stepOne2], components: [] })
                    const filter = m => interaction.user === author;
                    const collector = interaction.channel.createMessageCollector({ time: 15000 });
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.mentions.channels.first();
                            if (!C) return;
                            await guildDatabase.updateOne({
                                logChannelID: C
                            });
                            const updated = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed log channel to ${C}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated] })
                            collector.stop();
                            m.channel.send({ embeds: [stepTwo], components: [stepTwoToggle] })
                        } else {
                            if (m.author.bot) return;
                            const timedOut = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOut] });
                            m.channel.send({ embeds: [stepOne], components: [stepOneToggle] })
                        }
                    });
                }
                if (interaction.customId === "botaddonedisable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [stepOneDisabled] });
                    interaction.channel.send({ embeds: [stepOneTDisabled], components: [] })
                    interaction.channel.send({ embeds: [stepTwo], components: [stepTwoToggle] })
                }
                if (interaction.customId === "botaddtwoenable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [stepTwoToggleDisabled] });
                    interaction.channel.send({ embeds: [stepTwoChannel], components: [] })
                    const filter = m => interaction.user === author;
                    const collector = interaction.channel.createMessageCollector({ time: 15000 });
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.mentions.channels.first();
                            if (!C) return;
                            await guildDatabase.updateOne({
                                welcomeChannelID: C
                            });
                            const updated = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed welcome messages channel to ${C}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated] })
                            collector.stop();
                            m.channel.send({ embeds: [stepTwoRoleToggle], components: [stepTwoToggleTwo] })
                        } else {
                            if (m.author.bot) return;
                            const timedOut = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOut] });
                            m.channel.send({ embeds: [stepTwo], components: [stepTwoToggle] })
                        }
                    });
                }
                if (interaction.customId === "botaddtwodisable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [stepTwoToggleDisabled] });
                    interaction.channel.send({ embeds: [stepTwoTDisabled], components: [] })
                    interaction.channel.send({ embeds: [stepTwoRoleToggle], components: [stepTwoToggleTwo] })
                }
                if (interaction.customId === "botaddtoenable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [stepTwoToggleTwoDisabled] });
                    interaction.channel.send({ embeds: [stepTwoRole], components: [] });
                    const filter = m => interaction.user === author;
                    const collector = interaction.channel.createMessageCollector({ time: 15000 });
                    collector.on('collect', async m => {
                        if (m) {
                            if (m.author.bot) return;
                            if (m.content.lenght > 25) return;
                            await guildDatabase.updateOne({
                                mainRole: m.content
                            });
                            const updated5 = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed main role name to ${m.content}!`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated5] })
                            interaction.channel.send({ embeds: [stepThree], components: [stepThreeT] })
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            const timedOu5t = new discord.MessageEmbed()
                                .setTitle("❌ Timed Out!")
                                .setDescription("You took too long to respond.")
                                .setColor(colors.COLOR)
                            m.reply({ embeds: [timedOu5t] });
                            interaction.channel.send({ embeds: [stepTwoRoleToggle], components: [stepTwoToggleTwo] })
                        }
                    });
                }
                if (interaction.customId === "botaddtodisable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    await guildDatabase.updateOne({
                        roleEnabled: false
                    });
                    interaction.update({ components: [stepTwoToggleTwoDisabled] });
                    interaction.channel.send({ embeds: [stepToTDisabled], components: [] })
                    interaction.channel.send({ embeds: [stepThree], components: [stepThreeT] })
                }
                if (interaction.customId === "botaddthreedisable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [stepThreeTD] });
                    interaction.channel.send({ embeds: [done] });
                }
                if (interaction.customId === "botaddthreeenable") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.update({ components: [stepThreeTD] });
                    interaction.channel.send({ embeds: [stepThreeMainCat] });
                    setTimeout(() => {
                        let mainName = guildDatabase.ticketCategory;
                        if (mainName === undefined) openedName = 'Tickets';
                        const category = interaction.guild.channels.cache.find(cat => cat.name === mainName);

                        if (!category) {
                            interaction.guild.channels.create(mainName, { type: "GUILD_CATEGORY" });
                            const embedTicketsCreate = new discord.MessageEmbed()
                                .setColor(colors.TICKET_CREATED)
                                .setTitle('We could not find the category, so we created one!')
                                .setThumbnail("https://i.imgur.com/jgdQUul.png")
                                .setDescription('The category is called "Tickets" and can be found at the bottom of your channel list. We will now be looking for the Closed Tickets category called "Closed Tickets"!')
                                .setTimestamp()
                            interaction.channel.send({ embeds: [embedTicketsCreate] })
                        } else {
                            const found = new discord.MessageEmbed()
                                .setColor(colors.TICKET_CREATED)
                                .setTitle('Tickets Configuration (3/3)')
                                .setDescription('We found the tickets category! Looking for the "Closed Tickets" category now!')
                                .setThumbnail("https://i.imgur.com/jgdQUul.png")
                                .setTimestamp()
                            interaction.channel.send({ embeds: [found] })
                        }
                    }, 2000);
                    setTimeout(() => {
                        let closedName = guildDatabase.closedTicketCategory;
                        if (closedName === undefined) closedName = 'Closed Tickets';
                        const closedCategory = interaction.guild.channels.cache.find(cat => cat.name === closedName);

                        if (!closedCategory) {
                            interaction.guild.channels.create(closedName, { type: "GUILD_CATEGORY" });
                            const embedTicketsCreate2 = new discord.MessageEmbed()
                                .setColor(colors.TICKET_CREATED)
                                .setTitle('We could not find the closed tickets category, so we created one!')
                                .setThumbnail("https://i.imgur.com/jgdQUul.png")
                                .setDescription('The category is called "Closed Tickets" and can be found at the bottom of your channel list. We will now be looking for the Closed Tickets category called "Closed Tickets"!')
                                .setTimestamp()
                            interaction.channel.send({ embeds: [embedTicketsCreate2] })
                        } else {
                            const found2 = new discord.MessageEmbed()
                                .setColor(colors.TICKET_CREATED)
                                .setTitle('Tickets Configuration (3/3)')
                                .setDescription('We found the closed tickets category too!')
                                .setThumbnail("https://i.imgur.com/jgdQUul.png")
                                .setTimestamp()
                            interaction.channel.send({ embeds: [found2] });
                        }
                    }, 4000);
                    setTimeout(() => {
                        interaction.channel.send({ embeds: [done] });
                    }, 6000);
                }
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}