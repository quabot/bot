const { Interaction, Client, PermissionFlagsBits, ActionRowBuilder, TextInputStyle, ModalBuilder, TextInputBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { checkChannel } = require('../../../structures/functions/channel');
const { getPollConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const ms = require('ms');

module.exports = {
    name: "create",
    command: "poll",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const channel = interaction.options.getChannel("channel");
        const choices = interaction.options.getInteger("choices");
        const duration = interaction.options.getString("duration");

        const pollConfig = await getPollConfig(client, interaction.guildId);
        if (!pollConfig) return interaction.reply({
            embeds: [await generateEmbed(color, "We just created a new database record! Please run that command again.")], ephemeral: true
        }).catch((err => { }));

        if (pollConfig.pollEnabled === false) return interaction.reply({
            embeds: [await generateEmbed(color, "Polls are not enabled in this server. Toggle them on [our dashboard](https://dashboard.quabot.net).")], ephemeral: true
        }).catch((err => { }));

        if (!channel || !choices || !duration) return interaction.reply({
            embeds: [await generateEmbed(color, "Please run the command again, we didn't get all your options.")], ephemeral: true
        }).catch((err => { }));

        if (await checkChannel(channel.type) === false) return interaction.reply({
            embeds: [await generateEmbed(color, "Please enter a valid type of channel, i'd like one where i can actually talk.")], ephemeral: true
        }).catch((err => { }));

        if (!ms(duration)) return interaction.reply({
            embeds: [await generateEmbed(color, "Please enter a valid duration, like `1w` or `10min`.")], ephemeral: true
        }).catch((err => { }));


        const pollId = pollConfig.pollId + 1;
        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`Click the button below this message to enter the details for the poll.`)
                    .addFields(
                        { name: "Channel", value: `${channel}`, inline: true },
                        { name: "Duration", value: `${duration}`, inline: true },
                        { name: "Choices", value: `${choices}`, inline: true },
                    )
            ], ephemeral: true,
            components: [
                new ActionRowBuilder({
                    components: [
                        new ButtonBuilder({
                            style: ButtonStyle.Secondary,
                            label: 'Enter Details',
                            customId: "create-poll"
                        })]
                })
            ], fetchReply: true,
        });

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });
        collector.on('collect', async interaction => {
            if (interaction.customId === "create-poll") {

                const modal = new ModalBuilder()
                    .setTitle("Configure Poll")
                    .setCustomId("configure-poll")
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId("question")
                                    .setPlaceholder("Should we add more voice channels?")
                                    .setLabel("Poll Question")
                                    .setMaxLength(500)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                            )
                    )

                for (let i = 1; i < choices + 1; i++) {
                    modal.addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`${i}`)
                                    .setPlaceholder("Enter your option here...")
                                    .setLabel(`Option ${i}`)
                                    .setMaxLength(500)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                            )
                    )
                }

                const Poll = require('../../../structures/schemas/PollSchema');
                const newPoll = new Poll({
                    guildId: interaction.guildId,
                    pollId: pollId,
                    channelId: channel.id,
                    msgId: "none",
                    options: choices,
                    duration: ms(duration),
                    interactionId: msg.id,
                    createdTime: new Date().getTime(),
                    endTimestamp: new Date().getTime() + ms(duration),
                    optionsArray: []
                });
                newPoll.save().catch((err => { }));


                const PollConfig = require('../../../structures/schemas/PollConfigSchema');
                const config = await PollConfig.findOne({
                    guildId: interaction.guildId
                }).clone().catch((err => { }));
                await config.updateOne({
                    pollId,
                });

                // todo: create the poll msg, then start the timer & on ready start the timer too
                //       when finished make sure the poll actually finishes
                //       find something against double voting
                //       also add /poll end

                await interaction.showModal(modal);
            }
        })
    }
}