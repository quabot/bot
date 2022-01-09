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
    name: "role",
    description: "Give, remove, create and delete roles.",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "create",
            description: "Create a role.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "name",
                    description: "The role name.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "color",
                    description: "The hex color code of the color you want the role to have.",
                    type: "STRING",
                    required: false,
                },
            ],
        },
        {
            name: "delete",
            description: "Delete a role.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "role-name",
                    description: "The role you want to delete.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
        {
            name: "add",
            description: "Give someone a role.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to grant the role.",
                    type: "USER",
                    required: true,
                },
                {
                    name: "name-role",
                    description: "The name of the role you want to grant.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
        {
            name: "remove",
            description: "Remove a role from someone.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to remove the role.",
                    type: "USER",
                    required: true,
                },
                {
                    name: "name-role",
                    description: "The name of the role you want to remove.",
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
                    const name = interaction.options.getString("name");
                    let color = interaction.options.getString("color");

                    if (color) {
                        interaction.guild.roles.create({
                            name: `${name}`,
                            color: `${color}`,
                        }).then(role => {
                            const embed = new discord.MessageEmbed()
                                .setColor(colors.COLOR)
                                .setTitle("Created role!")
                                .setDescription("Succesfully created the role <@&" + role + ">!")
                                .setTimestamp()
                            interaction.reply({ embeds: [embed] });
                        }).catch(console.error);
                    } else {
                        interaction.guild.roles.create({
                            name: `${name}`
                        }).then(role => {
                            const embedTwo = new discord.MessageEmbed()
                                .setColor(colors.COLOR)
                                .setTitle("Created role!")
                                .setDescription("Succesfully created the role <@&" + role + ">!")
                                .setTimestamp()
                            interaction.reply({ embeds: [embedTwo] });
                        }).catch(console.error);
                    }
                    break;
                }
                case "delete": {
                    const roleName = interaction.options.getString("role-name");
                    interaction.guild.roles.cache.forEach(role => {
                        if (roleName === role.name) {
                            role.delete();
                        }
                    });
                    const embed = new discord.MessageEmbed()
                        .setTitle("Role(s) Deleted!")
                        .setDescription(`Deleted all roles with the name **${roleName}**!`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });
                    break;
                }
                case "add": {
                    const user = interaction.options.getUser("user");
                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    const roleName = interaction.options.getString("name-role");
                    let role = interaction.guild.roles.cache.find(role => role.name === `${roleName}`);
                    if (!role) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(":x: No Role!")
                            .setDescription(`Could not find a role with the name **${roleName}**!`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        interaction.reply({ embeds: [embed] });
                        return;
                    } else {
                        memberTarget.roles.add(role);
                        const embed = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Role granted!")
                            .setDescription(`Gave the role ${role} to ${user}!`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        interaction.reply({ embeds: [embed] });
                    }
                    break;
                }
                case "remove": {
                    const user = interaction.options.getUser("user");
                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    const roleName = interaction.options.getString("name-role");
                    let role = interaction.guild.roles.cache.find(role => role.name === `${roleName}`);
                    if (!role) {
                        const embed = new discord.MessageEmbed()
                            .setTitle(":x: No Role!")
                            .setDescription(`Could not find a role with the name **${roleName}**!`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        interaction.reply({ embeds: [embed] });
                        return;
                    } else {
                        memberTarget.roles.remove(role);
                        const embed = new discord.MessageEmbed()
                            .setTitle(":white_check_mark: Role removed!")
                            .setDescription(`Removed the role ${role} from ${user}!`)
                            .setColor(colors.COLOR)
                            .setTimestamp()
                        interaction.reply({ embeds: [embed] });
                    }
                    break;
                }
            }

        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}