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
                        { name: "normal", value: "normal" },
                        { name: "unqiue", value: "unqiue" },
                        { name: "verify", value: "verify" },
                        { name: "drop", value: "drop" },
                        { name: "binding", value: "binding" }
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
                    const role = interaction.options.getString('role');
                    const emoji = interaction.options.getString('emoji');
                    const mode = interaction.options.getString('mode');


                    //channel type check
                    // check if message exists if it doesnt ask to create
                    // check if role permissions
                    // check if emoji exists
                    // if no mode set to normal
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