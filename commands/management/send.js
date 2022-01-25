const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain, invalidEmojis } = require('../../files/embeds');

const noValidChannel = new discord.MessageEmbed()
    .setTitle(":x: Please enter a valid text channel to create the reaction role in!")
    .setColor(colors.COLOR)
    .setTimestamp()
const noMsgFound = new discord.MessageEmbed()
    .setTitle("Could not find that message!")
    .setDescription("Please send one first.")
    .setColor(colors.COLOR)
    .setTimestamp()

module.exports = {
    name: "send",
    description: "Send messages and embeds.",
    permission: "MANAGE_MESSAGES",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "message",
            description: "Send a regular message.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The channel where the message is/needs to be",
                    type: "CHANNEL",
                    required: true,
                },
            ],
        },
        {
            name: "embed",
            description: "Send a message embed.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The channel to send the embed in.",
                    type: "CHANNEL",
                    required: true,
                },
                {
                    name: "title",
                    description: "The embed title.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "description",
                    description: "The embed description.",
                    type: "STRING",
                    required: false,
                },
                {
                    name: "footer",
                    description: "The embed footer.",
                    type: "STRING",
                    required: false,
                },
                {
                    name: "color",
                    description: "The caolor the embed needs to be.",
                    type: "STRING",
                    required: false,
                },
                {
                    name: "field-title",
                    description: "Field 1, title.",
                    type: "STRING",
                    required: false,
                },
                {
                    name: "field-content",
                    description: "Field 1, title.",
                    type: "STRING",
                    required: false,
                },
                {
                    name: "field-title-2",
                    description: "Field 2, title.",
                    type: "STRING",
                    required: false,
                },
                {
                    name: "field-content-2",
                    description: "Field 2, content.",
                    type: "STRING",
                    required: false,
                },
            ],
        },
    ],

    async execute(client, interaction) {

        try {

            const { options } = interaction;
            const Sub = options.getSubcommand();

            switch (Sub) {
                case "message": {
                    const channel = interaction.options.getChannel('channel');
                    if (channel.type !== "GUILD_TEXT") {
                        const invalidText = new discord.MessageEmbed()
                            .setDescription(`Invalid text channel.`)
                            .setColor(colors.COLOR)
                        interaction.reply({ ephemeral: true, embeds: [invalidText] });
                        return;
                    }
                    const message = new discord.MessageEmbed()
                        .setDescription(`Reply with the message you want to send to ${channel} within 60 seconds.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [message] });

                    const filter = m => interaction.user === m.author;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

                    collector.on('collect', async m => {
                        if (m) {
                            if (m.author.bot) return;
                            const D = m.content;
                            if (!D) return;
                            const messageSentTooLong = new discord.MessageEmbed()
                                .setDescription(`Your message is too long to be sent.`)
                                .setColor(colors.COLOR)
                            if (m.content.length > 1999) return m.channel.send({ embeds: [messageSentTooLong] });
                            channel.send(D)
                            const messageSent = new discord.MessageEmbed()
                                .setDescription(`Your message has been sent to ${channel}.`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [messageSent] });
                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                    break;
                }
                case "embed": {
                    const channel = interaction.options.getChannel('channel');
                    const title = interaction.options.getString('title');
                    const description = interaction.options.getString('description');
                    const footer = interaction.options.getString('footer');
                    const color = interaction.options.getString('color');
                    const title1 = interaction.options.getString('field-title');
                    const title2 = interaction.options.getString('field-title-2');
                    const content1 = interaction.options.getString('field-content');
                    const content2 = interaction.options.getString('field-content-2');

                    if (channel.type !== "GUILD_TEXT") {
                        const invalidText = new discord.MessageEmbed()
                            .setDescription(`Invalid text channel.`)
                            .setColor(colors.COLOR)
                        interaction.reply({ ephemeral: true, embeds: [invalidText] });
                        return;
                    }

                    const embed = new discord.MessageEmbed()
                    if (title) embed.setTitle(title)
                    if (color) embed.setColor(color)
                    if (description) embed.setDescription(description)
                    if (footer) embed.setFooter(footer)
                    if (title1 && content1) embed.addField(title1, content1)
                    if (title2 && content2) embed.addField(title2, content2)

                    const messageSent = new discord.MessageEmbed()
                        .setDescription(`Your embed has been sent to ${channel}.`)
                        .setColor(colors.COLOR)
                    interaction.reply({ embeds: [messageSent] });
                    channel.send({ embeds: [embed] });
                    break;
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}