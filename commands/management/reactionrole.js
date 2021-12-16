const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds');

const noValidChannel = new discord.MessageEmbed()
    .setTitle(":x: Please enter a valid text channel to create the reaction role in!")
    .setColor(colors.COLOR)
    .setTimestamp()
const noMsgFound = new discord.MessageEmbed()
    .setTitle("Could not find that message!")
    .setDescription("Would like to create the message? React with :white_check_mark: to continue.")
    .setColor(colors.COLOR)
    .setTimestamp()

module.exports = {
    name: "reactionrole",
    description: "Setup reaction roles",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "create",
            description: "Create a reaction role.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The channel where the message is/needs to be",
                    type: "CHANNEL",
                    required: true,
                },
                {
                    name: "message",
                    description: "The message Id of a pre exising message to use, or the message text you want quabot to create.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "role",
                    description: "The role to use.",
                    type: "ROLE",
                    required: true,
                },
                {
                    name: "emoji",
                    description: "The emoji to use.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "mode",
                    description: "The reaction mode, verify or normal. (When not specified defaults to normal)",
                    type: "STRING",
                    required: false,
                    choices: [
                        { name: "normal", value: "Normal" },
                        { name: "verify", value: "Verify" }
                    ]
                },
            ],
        },
        {
            name: "delete",
            description: "Delete a reaction role.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "message-id",
                    description: "The message ID or Reaction Role id.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction) {

        try {
            const { options } = interaction;
            const Sub = options.getSubcommand();

            switch (Sub) {
                case "create": {
                    const channel = interaction.options.getChannel("channel");
                    const message = interaction.options.getString("message");
                    const role = interaction.options.getRole("role");
                    const emoji = interaction.options.getString("emoji");
                    let mode = interaction.options.getString("mode");

                    if (mode === null) mode = 'normal';

                    if (channel.type !== "GUILD_TEXT") {
                        return interaction.reply({ embeds: [noValidChannel] });
                    }

                    const emojiurls = client.emojis
                        .filter(emoji => emoji.available)
                        .map(emoji => {
                            return { "name": emoji.name, "url": emoji.url };
                        });
                    return res.json(emojiurls);

                    channel.messages.fetch(message)
                        .then(async message => {
                            console.log(message.content)
                        })
                        .catch(async err => {
                            const message = await interaction.reply({ embeds: [noMsgFound], fetchReply: true });
                            message.react('✅');
                        })

                    const React = require('../../schemas/ReactSchema');
                    const newReact = new React({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        channel: channel,
                        messageId: message,
                        emoji: emoji,
                        reactMode: mode,
                    });
                    newReact.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                }
                    break;
                case "delete": {
                    const messageId = interaction.options.getChannel("message-id");
                    console.log(messageId);
                }
                    break;
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}