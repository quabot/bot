const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { noChannel } = require('../../embeds/management');
const { COLOR_MAIN } = require('../../files/colors.json');

const noMsgFound = new MessageEmbed().setTitle("Could not find that message!").setDescription("Please send one first.").setColor(COLOR_MAIN)

module.exports = {
    name: "reactionrole",
    description: "Setup reaction roles..",
    permission: "MANAGE_CHANNELS",
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
                        { name: "normal", value: "normal" },
                        { name: "verify", value: "verify" },
                        { name: "drop", value: "drop" }
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
                {
                    name: "reaction",
                    description: "The emoji reaction to remove.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
        {
            name: "list",
            description: "List all reaction roles.",
            type: "SUB_COMMAND",
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

                    if (channel.type !== "GUILD_TEXT") return interaction.reply({ embeds: [noValidChannel] }).catch(err => console.log(err));
                    

                    channel.messages.fetch(message)
                        .then(async message => {
                            let embed = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription("Succesfully created a new reaction role.")
                                .addField("Emoji", `${emoji}`, true)
                                .addField("Channel", `${channel}`, true)
                                .addField("Role", `${role}`, true)
                                .addField("Mode", `${mode}`, true)
                                
                                .setColor(COLOR_MAIN)
                            message.react(`${emoji}`).catch(err => {
                                const noRole = new MessageEmbed()
                                    .setTitle(":x: No Emoji!")
                                    .setDescription(`Could not find that emoji! You can only react with default emojis.`)
                                    .setColor(COLOR_MAIN)
                                    
                                interaction.channel.send({ embeds: [noRole] }).catch(err => console.log(err));
                                return;
                            })
                            interaction.reply({ ephemeral: true, embeds: [embed] }).catch(err => console.log(err));
                        })
                        .catch(async err => {
                            await interaction.channel.send({ embeds: [noMsgFound], fetchReply: true }).catch(err => console.log(err));
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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                }
                    break;
                case "delete": {
                    const messageId = interaction.options.getString("message-id");
                    const emoji = interaction.options.getString("reaction");
                    const React = require('../../schemas/ReactSchema');
                    React.deleteOne({
                        guildId: interaction.guild.id,
                        messageId: messageId,
                        emoji: emoji,
                    }, (err, react) => {
                        if (err) return;
                        if (!react) return interaction.channel.send("Could not find a message with that ID!").catch(err => console.log(err));
                    });
                    const embed3 = new MessageEmbed()
                        .setTitle("Deleted the reaction role!")
                        .addField("ID", `${messageId}`)
                        .addField("Emoji", `${emoji}`)
                        
                        .setColor(COLOR_MAIN)
                    interaction.reply({ ephemeral: true, embeds: [embed3]}).catch(err => console.log(err));
                }
                    break;
                case "list": {
                    const React = require('../../schemas/ReactSchema');
                    const reactList = await React.find({
                        guildId: interaction.guild.id,
                    }, (err, react) => {
                        if (err) console.error(err);
                        if (!react) {
                            return interaction.channel.send("There are no reaction roles.").catch(err => console.log(err));
                        }
                        return;
                    }).clone().catch(function (err) { console.log(err) });
                    const reacts = reactList.map(e => `**Message ID:**\n${e.messageId}\n**Role**\n<@&${e.role}>\n**Emoji**\n${e.emoji}`);

                    const reactEmbed = new MessageEmbed()
                        .setColor(COLOR_MAIN)
                        .setTitle(`${interaction.guild.name} Reaction Roles`)
                        
                        .setDescription(`${reacts.join("\n\n")}`)
                    interaction.reply({ ephemeral: true, embeds: [reactEmbed] }).catch(err => {
                        interaction.channel.send("The list is too long to be sent to this channel. Please contact the developers.").catch(err => console.log(err));
                    });
                }
                    break;
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log(err));
            return;
        }
    }
}