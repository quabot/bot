const { Client, Interaction, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getPollConfig } = require('../../structures/functions/config');
const { generateEmbed } = require('../../structures/functions/embed');
const Poll = require('../../structures/schemas/PollSchema');
const ms = require('ms');
const { endPoll } = require('../../structures/functions/guilds');

module.exports = {
    id: "info-poll",
    /**
     * @param {Client} client 
     * @param {import("discord.js").ModalSubmitInteraction} interaction 
     */
    async execute(client, interaction, color) {

        const question = interaction.fields.getTextInputValue("question");
        let description = interaction.fields.getTextInputValue("description");


        const pollConfig = await getPollConfig(client, interaction.guildId);
        if (!pollConfig) return interaction.reply({
            embeds: [await generateEmbed(color, "We just created a new database record! Please run that command again.")], ephemeral: true
        }).catch((e => { }));

        if (pollConfig.pollEnabled === false) return interaction.reply({
            embeds: [await generateEmbed(color, "Polls are not enabled in this server. Toggle them on [our dashboard](https://dashboard.quabot.net).")], ephemeral: true
        }).catch((e => { }));


        const pollDocument = await Poll.findOne({
            interactionId: interaction.message.id,
            guildId: interaction.guildId,
        }).clone().catch((e => { }));
        if (!pollDocument) return interaction.reply({
            embeds: [await generateEmbed(color, "An internal error occurred.")], ephemeral: true
        }).catch((e => { }));

        if (pollDocument.optionsArray.length !== 0 && description && question) {

            let desc = description;

            let options = [];
            pollDocument.optionsArray.map(item => options.push(`${item}`));

            for (let index = 0; index < options.length; index++) {
                const option = options[index];
                const emoji = `${index}`.replace('0', ':one:').replace('1', ':two:').replace('2', ':three:').replace('3', ':four:').replace('4', ':five:');
                if (desc) desc = `${desc}\n${emoji} - ${option}`;
            }

            let role = interaction.guild.roles.cache.get(`${pollConfig.pollRole}`);
            if (!role) role = "";

            const embed = new EmbedBuilder()
                .setTitle(`${question}`)
                .setDescription(`${desc}`)
                .addFields(
                    { name: "Hosted by", value: `${interaction.user}`, inline: true },
                    { name: "Ends in", value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDocument.duration) / 1000)}:R>`, inline: true }
                )
                .setFooter({ text: `ID: ${pollDocument.pollId}` })
                .setTimestamp()
                .setColor(color);

            const channel = interaction.guild.channels.cache.get(pollDocument.channelId);
            if (!channel) return interaction.editReply({
                embeds: [await generateEmbed(color, "The channel where you wanted to create the poll couldn't be found! Do i have access to it?")], ephemeral: true
            }).catch((e => { }));


            const msg = await channel.send({ embeds: [embed], content: `${role}` }).catch(async err => {
                interaction.editReply({
                    embeds: [await generateEmbed(color, "I do not have permission to talk in the channel where you want to poll to be posted in.")], ephemeral: true
                }).catch((e => { }));
            });
            if (!msg) return;


            const logChannel = interaction.guild.channels.cache.get(pollConfig.pollLogChannelId);
            if (logChannel && pollConfig.pollLogEnabled) logChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New Poll!")
                        .setTimestamp()
                        .setDescription(pollDocument.description)
                        .addFields(
                            { name: "Question", value: `${pollDocument.question}` },
                            { name: "Options", value: `${pollDocument.options}` },
                            { name: "Created by", value: `${interaction.user}`, inline: true },
                            { name: "Ends in", value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDocument.duration) / 1000)}:R>`, inline: true },
                            { name: "Message", value: `[Click to jump](${msg.url})`, inline: true }
                        )
                        .setColor(color)
                ]
            }).catch(async err => {
                interaction.editReply({
                    embeds: [await generateEmbed(color, "I do not have permission to talk in the log channel.")], ephemeral: true
                }).catch((e => { }));
            });

            for (let i = 0; i < pollDocument.options; i++) {
                let reactionEmoji = `${i + 1}`;

                msg.react(`${reactionEmoji.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣").replace("5", "5️⃣")}`)
            }

            await pollDocument.updateOne({
                msgId: msg.id,
                endTimestamp: Math.round(new Date().getTime()) + Math.round(ms(pollDocument.duration)),
                topic: question,
                description
            });

            interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Successfully created a poll that ends <t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDocument.duration) / 1000)}:R> in ${channel}!\nThe ID for this poll is ${pollDocument.pollId}`)
                        .setColor(color)
                ], ephemeral: true, components: []
            }).catch((e => { }));

            setTimeout(async () => {
                await endPoll(client, pollDocument, color);
            }, ms(pollDocument.duration));
            
        } else {

            interaction.update({
                embeds: [new EmbedBuilder()
                .setColor(color)
                    .addFields(
                        { name: "Question", value: question, inline: true},
                        { name: "Description", value: description, inline: true},
                        { name: "Channel", value: `<#${pollDocument.channelId}>`, inline: true},
                        { name: "Duration", value: `${pollDocument.duration}ms`, inline: true},
                        { name: "Choices", value: `${pollDocument.options}`, inline: true}
                    )
            .setDescription("Click the button below this message to enter the details for the poll. When entered, click the _second_ button to enter the choices.")],
                components: [
                    new ActionRowBuilder({
                        components: [
                            new ButtonBuilder({
                                style: ButtonStyle.Secondary,
                                label: 'Edit Details',
                                customId: "details-poll"
                            }),
                            new ButtonBuilder({
                                style: ButtonStyle.Secondary,
                                label: 'Enter Choices',
                                customId: "choices-poll"
                            })]
                    })
                ]
            }).catch(() => { });

            await pollDocument.updateOne({
                topic: question,
                description
            });
        }
    }
} 