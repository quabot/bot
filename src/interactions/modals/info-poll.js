const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { getPollConfig } = require('../../structures/functions/config');
const { generateEmbed } = require('../../structures/functions/embed');
const Poll = require('../../structures/schemas/PollSchema');
const ms = require('ms');
const { endPoll } = require('../../structures/functions/guilds');

module.exports = {
    id: "info-poll",
    /**
     * @param {Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {


        await interaction.deferReply({ ephemeral: true }).catch((e => { }));
        const question = interaction.fields.getTextInputValue("question");
        let description = interaction.fields.getTextInputValue("description");


        const pollConfig = await getPollConfig(client, interaction.guildId);
        if (!pollConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just created a new database record! Please run that command again.")], ephemeral: true
        }).catch((e => { }));

        if (pollConfig.pollEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Polls are not enabled in this server. Toggle them on [our dashboard](https://dashboard.quabot.net).")], ephemeral: true
        }).catch((e => { }));


        const pollDocument = await Poll.findOne({
            interactionId: interaction.message.id,
            guildId: interaction.guildId,
        }).clone().catch((e => { }));
        if (!pollDocument) return interaction.editReply({
            embeds: [await generateEmbed(color, "An internal error occurred.")], ephemeral: true
        }).catch((e => { }));

        if (pollDocument.optionsArray.length !== 0 && description && question) {
            pollDocument.optionsArray.map(item => {

                for (let index = 0; index < pollDocument.optionsArray.length; index++) {
                    const option = array[index];
                    const emoji = `${index}`.replace("0", "1️⃣").replace("1", "2️⃣").replace("2", "3️⃣").replace("3", "4️⃣").replace("4", "5️⃣");
                    if (description) description = `${description}\n${emoji} - ${option}`;
                }
            });

            console.log(description)
            return;


            const embed = new EmbedBuilder()
                .setTitle(`${question}`)
                .setDescription(`${description}`)
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


            const msg = await channel.send({ embeds: [embed] }).catch(async err => {
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
                        .setDescription(interaction.fields.getTextInputValue("description"))
                        .addFields(
                            { name: "Question", value: `${question}` },
                            { name: "Options", value: `${description}` },
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

                msg.react(`${reactionEmoji.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣")}`)
            }

            let arrayOptions = [];
            interaction.components.map(item => {
                if (item.components[0].customId === "question") return;

                const componentId = `${item.components[0].customId}`;
                const emoji = componentId;
                const option = item.components[0].value;

                arrayOptions.push(`${option}`);
            });

            await pollDocument.updateOne({
                msgId: msg.id,
                endTimestamp: Math.round(new Date().getTime()) + Math.round(ms(pollDocument.duration)),
                optionsArray: arrayOptions
            });

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Successfully created a poll that ends <t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDocument.duration) / 1000)}:R> in ${channel}!\nThe ID for this poll is ${pollDocument.pollId}`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((e => { }));

            setTimeout(async () => {
                await endPoll(client, pollDocument, color);
            }, ms(pollDocument.duration));
        } else {
            interaction.reply("Not finished yet, still missing some options")
        }
    }
}