const { MessageEmbed, MessageButton, MessageActionRow, Message } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

const ms = require('ms');

module.exports = {
    name: "poll",
    description: 'Manage polls.',
    options: [
        {
            name: "create",
            description: "Create a poll.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    type: "CHANNEL",
                    required: true,
                    description: "Channel to create the poll in."
                },
                {
                    name: "options",
                    type: "INTEGER",
                    required: true,
                    description: "Amount of poll choices.",
                    choices: [
                        { name: "1", value: 1 },
                        { name: "2", value: 2 },
                        { name: "3", value: 3 },
                        { name: "4", value: 4 },
                    ]
                },
                {
                    name: "duration",
                    type: "STRING",
                    required: true,
                    description: "How long the poll will last.",
                },
            ]
        },
        {
            name: "end",
            description: "End a poll.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "id",
                    type: "STRING",
                    required: true,
                    description: "The poll id to end."
                }
            ]
        },
        {
            name: "setduration",
            description: "Set a new poll duration.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "id",
                    type: "STRING",
                    required: true,
                    description: "The poll id to change the duration of."
                },
                {
                    name: "new-duration",
                    type: "STRING",
                    required: true,
                    description: "The new duration for the poll."
                }
            ]
        }
    ],
    permission: "ADMINISTRATOR",
    async execute(client, interaction, color) {
        try {

            const subCmd = interaction.options.getSubcommand();

            switch (subCmd) {
                case 'create':
                    const channel = interaction.options.getChannel("channel");
                    const options = interaction.options.getInteger("options");
                    const duration = interaction.options.getString("duration");

                    if (channel.type !== "GUILD_TEXT") return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Please enter a valid text channel.`)
                        ], ephemeral: true
                    });

                    if (!ms(duration)) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Please enter a valid poll duration.`)
                        ], ephemeral: true
                    });

                    const msg = await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Click the button below this message to enter the details for the poll.`)
                                .addFields(
                                    { name: "Channel", value: `${channel}`, inline: true },
                                    { name: "Duration", value: `${duration}`, inline: true },
                                    { name: "Choices", value: `${options}`, inline: true },
                                )
                        ], ephemeral: true,
                        components: [
                            new MessageActionRow({
                                components: [
                                    new MessageButton({
                                        style: 'PRIMARY',
                                        label: 'Enter Details',
                                        customId: "createPoll"
                                    })]
                            })
                        ], fetchReply: true,
                    });

                    const collectorRepeat = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                    collectorRepeat.on('collect', async interaction => {
                        if (interaction.customId === "createPoll") {

                            const pollDetails = new Modal()
                                .setCustomId('poll')
                                .setTitle('Create a poll!')
                                .addComponents(
                                    new TextInputComponent()
                                        .setCustomId('poll-question')
                                        .setLabel('Enter the poll question.')
                                        .setStyle('SHORT')
                                        .setMinLength(1)
                                        .setMaxLength(200)
                                        .setPlaceholder('Enter here')
                                        .setRequired(true)
                                )

                            for (let i = 0; i < options; i++) {

                                pollDetails.addComponents(
                                    new TextInputComponent()
                                        .setCustomId(`poll-${i}`)
                                        .setLabel(`Enter choice ${i}`)
                                        .setStyle('SHORT')
                                        .setMinLength(1)
                                        .setMaxLength(200)
                                        .setPlaceholder('Enter here')
                                        .setRequired(true)
                                )

                            }

                            showModal(pollDetails, {
                                client: client,
                                interaction: interaction
                            });

                        }
                    });

                    break;
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}