const { MessageEmbed } = require("discord.js");
const ms = require('ms');

module.exports = {
    id: "poll",
    permission: "ADMINISTRATOR",
    async execute(interaction, client, color) {
        const question = interaction.fields.getTextInputValue('poll-question');
        let description;

        await interaction.deferReply({ ephemeral: true });

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
                        ticketCategory: "none",
                        ticketClosedCategory: "none",
                        ticketEnabled: true,
                        ticketStaffPing: true,
                        ticketTopicButton: true,
                        ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                    suggestChannelID: "none",
                    logSuggestChannelID: "none",
                    logPollChannelID: "none",
                        afkEnabled: true,
                    welcomeChannelID: "none",
                        leaveChannelID: "none",
                    levelChannelID: "none",
                    logEnabled: true,
                    modEnabled: true,
                    levelEnabled: false,
                    welcomeEmbed: true,
                    pollEnabled: true,
                    suggestEnabled: true,
                    welcomeEnabled: true,
                    leaveEnabled: true,
                    roleEnabled: false,
                    mainRole: "none",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    leaveMessage: "Goodbye {user}!",
                    swearEnabled: false,
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        const Poll = require('../../structures/schemas/PollSchema');
        const pollDatabase = await Poll.findOne({
            guildId: interaction.guild.id,
            interactionId: interaction.message.id,
        }, (err, poll) => {
            if (err) console.error(err);
            if (!poll) return;
        }).clone().catch(function (err) { console.log(err) });

        if (!pollDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`That poll does not exist.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        interaction.components.map(item => {
            if (item.components[0].customId === "poll-question") return;

            const cId = `${item.components[0].customId}`;
            const id = cId.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣");
            const value = item.components[0].value;

            if (description) description = `${description}\n${id} - ${value}`;
            if (!description) description = `${id} - ${value}`;
        });

        const embed = new MessageEmbed()
            .setTitle(`${question}`)
            .setDescription(`${description}`)
            .addFields(
                { name: "Hosted by", value: `${interaction.user}`, inline: true },
                { name: "Ends in", value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDatabase.duration) / 1000)}:R>`, inline: true }
            )
            .setFooter(`ID: ${pollDatabase.pollId}`)
            .setTimestamp()
            .setColor(color);

        const channel = interaction.guild.channels.cache.get(pollDatabase.channelId);
        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Could not find the channel.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }))
        const msg = await channel.send({ embeds: [embed] }).catch(err => {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`I don't have the required permissions to send messages in that channel.`)
                        .setColor(color)
                ], ephemeral: true, fetchReply: true
            }).catch((err => { }))
        });

        if (!msg) return;

        const pollLogChannel = interaction.guild.channels.cache.get(guildDatabase.logPollChannelID);
        if (pollLogChannel) {
            pollLogChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("New Poll!")
                        .setTimestamp()
                        .addFields(
                            { name: "Question", value: `${question}` },
                            { name: "Options", value: `${description}` },
                            { name: "Created by", value: `${interaction.user}`, inline: true },
                            { name: "Ends in", value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDatabase.duration) / 1000)}:R>`, inline: true },
                            { name: "Message", value: `[Click to jump](${msg.url})`, inline: true }
                        )
                        .setColor(color)
                ]
            }).catch(err => {
                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`I don't have the required permissions to send messages in the suggestions log channel. Please contact an admin.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }))
            });
        }

        for (let i = 0; i < pollDatabase.options; i++) {
            let b = `${i + 1}`;

            msg.react(`${b.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣")}`)
        }

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Succesfully created a poll that ends <t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDatabase.duration) / 1000)}:R> in ${channel}!\nThe ID for this poll is ${pollDatabase.pollId}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        await pollDatabase.updateOne({
            msgId: msg.id,
            endTimestamp: Math.round(new Date().getTime()) + Math.round(ms(pollDatabase.duration)),
        });
    }
}