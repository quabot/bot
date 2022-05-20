const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "reactionrole",
    description: 'Manage the reaction roles.',
    permission: "MANAGE_ROLES",
    options: [
        {
            name: "create",
            description: "Create a reaction role.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The channel.",
                    type: "CHANNEL",
                    required: true
                },
                {
                    name: "message",
                    description: "The message id/message to be sent.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "role",
                    description: "The role.",
                    type: "ROLE",
                    required: true
                },
                {
                    name: "emoji",
                    description: "The emoji.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "mode",
                    description: "The mode.",
                    type: "STRING",
                    required: false,
                    choices: [
                        { name: "Normal", value: "Normal" },
                        { name: "Unique", value: "Unique" },
                        { name: "Verify", value: "Verify" },
                        { name: "Drop", value: "Drop" },
                        { name: "Binding", value: "Binding" }
                    ]
                }
            ],
        },
        {
            name: "list",
            type: "SUB_COMMAND",
            description: "View a list of reaction roles on a message.",
            options: [
                {
                    name: "message",
                    description: "The message id.",
                    required: true,
                    type: "STRING"
                }
            ]
        },
        {
            name: "remove",
            type: "SUB_COMMAND",
            description: "Remove a reaction role.",
            options: [
                {
                    name: "message",
                    description: "The message id.",
                    required: true,
                    type: "STRING"
                },
                {
                    name: "role",
                    description: "The role to remove.",
                    required: true,
                    type: "ROLE"
                }
            ]
        }
    ],
    async execute(client, interaction, color) {
        try {
            const subCmd = interaction.options.getSubcommand();

            switch (subCmd) {
                case 'create':
                    const channel = interaction.options.getChannel('channel');
                    const message = interaction.options.getString('message');
                    const role = interaction.options.getRole('role');
                    const emoji = interaction.options.getString('emoji');
                    let mode = interaction.options.getString('mode');

                    if (!mode) mode = "Normal";

                    if (channel.type !== "GUILD_TEXT") return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription("We have disabled that feature in this release.")
                        ]
                    }).catch((err => { }));

                    console.log(interaction.guild.me)

                    console.log(interaction.guild.me.roles.highest.rawPosition)
                    console.log(role.rawPosition)
                    if (role.rawPosition > interaction.guild.me.roles.highest.rawPosition) return interaction.reply({
                        ephemeral: true, embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription("I cannot give that role to users.")
                        ]
                    }).catch((err => { }));

                    await interaction.deferReply({ ephemeral: true });

                    channel.messages.fetch(message)
                        .then(async message => {
                            message.react(`${emoji}`).catch(err => {
                                return interaction.followUp({
                                    ephemeral: true, embeds: [
                                        new MessageEmbed()
                                            .setDescription(`Could not find that emoji! You can only react with default emojis.`)
                                            .setColor(color)
                                    ]
                                }).catch((err => { }));
                            });

                            interaction.followUp({
                                ephemeral: true, embeds: [
                                    new MessageEmbed()
                                        .setDescription("Succesfully created a new reaction role.")
                                        .addField("Emoji", `${emoji}`, true)
                                        .addField("Channel", `${channel}`, true)
                                        .addField("Role", `${role}`, true)
                                        .addField("Mode", `${mode}`, true)
                                        .setColor(color)
                                ]
                            }).catch((err => { }));

                            const Reaction = require('../../structures/schemas/ReactionSchema');
                            const newReaction = new Reaction({
                                guildId: interaction.guild.id,
                                guildName: interaction.guild.name,
                                messageId: message.id,
                                emoji: emoji,
                                reactMode: mode,
                                role: role.id
                            });
                            newReaction.save()
                                .catch(err => {
                                    console.log(err);
                                    interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                                });

                        })
                        .catch(async err => {
                            await interaction.followUp({
                                ephemeral: true, embeds: [
                                    new MessageEmbed()
                                        .setColor(color)
                                        .setDescription("Could not find that message.")
                                ]
                            }).catch((err => { }))
                            return;
                        });
                    break;

                case 'list':
                    break;

                case 'remove':
                    break;
            }
        }
        catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}