const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain, invalidEmojis } = require('../../files/embeds');

const noValidChannel = new discord.MessageEmbed()
    .setTitle(":x: Please enter a valid text channel to create the reaction role in!")
    .setColor(colors.COLOR)
    .setTimestamp()
const noMsgFound = new discord.MessageEmbed()
    .setTitle("Could not find that message!")
    .setDescription("Would like to create the message? React with :white_check_mark: within 15 seconds to continue.")
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
                    let channel = interaction.options.getChannel("channel");
                    let message = interaction.options.getString("message");
                    let role = interaction.options.getRole("role");
                    let emoji = interaction.options.getString("emoji");
                    let mode = interaction.options.getString("mode");

                    if (mode === null) mode = 'normal';

                    if (channel.type !== "GUILD_TEXT") {
                        return interaction.reply({ embeds: [noValidChannel] });
                    }

                    channel.messages.fetch(message)
                        .then(async message => {
                            let embed = new discord.MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription("Succesfully created a new reaction role.")
                                .addField("Emoji", `${emoji}`, true)
                                .addField("Channel", `${channel}`, true)
                                .addField("Role", `${role}`, true)
                                .addField("Mode", `${mode}`, true)
                                .setTimestamp()
                                .setColor(colors.COLOR)
                            try {
                                message.react(`${emoji}`);
                            } catch (e) {
                                console.log(e)
                                interaction.channel.send({ embeds: [invalidEmojis] });
                                return
                            }
                            interaction.reply({ embeds: [embed] });
                        })
                        .catch(async err => {
                            const noMsg = await interaction.channel.send({ embeds: [noMsgFound], fetchReply: true });
                            noMsg.react('✅');
 
                            return;
                        })

                    const React = require('../../schemas/ReactSchema');
                    const newReact = new React({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        channel: channel,
                        messageId: message,
                        emoji: emoji,
                        reactMode: mode,
                        role: role.id,
                    });
                    newReact.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                }
                    break;

                    // if exists return
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