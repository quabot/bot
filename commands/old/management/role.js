const { MessageEmbed } = require('discord.js');

const { error } = require('../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');


module.exports = {
    name: "role",
    description: "Give, remove, create and delete roles.",
    permission: "MANAGE_ROLES",
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
                    name: "role",
                    description: "The role you want to delete.",
                    type: "ROLE",
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
                    name: "role",
                    description: "The name of the role you want to grant.",
                    type: "ROLE",
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
                    name: "role",
                    description: "The name of the role you want to remove.",
                    type: "ROLE",
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
                            const embed = new MessageEmbed()
                                .setColor(COLOR_MAIN)
                                .setTitle("Created role!")
                                .setDescription("Succesfully created the role <@&" + role + ">!")
                                
                            interaction.reply({ embeds: [embed] }).catch(( err => { } ))
                        }).catch(( err => { } ))
                    } else {
                        interaction.guild.roles.create({
                            name: `${name}`
                        }).then(role => {
                            const embedTwo = new MessageEmbed()
                                .setColor(COLOR_MAIN)
                                .setTitle("Created role!")
                                .setDescription("Succesfully created the role <@&" + role + ">!")
                                
                            interaction.reply({ embeds: [embedTwo] }).catch(( err => { } ))
                        }).catch(( err => { } ))
                    }
                    break;
                }
                case "delete": {
                    const role = interaction.options.getRole("role");
                    role.delete().catch(( err => { } ))

                    const embed = new MessageEmbed()
                        .setTitle("Role Deleted!")
                        .setDescription(`Deleted role **${role.name}**!`)
                        .setColor(COLOR_MAIN)
                        
                    interaction.reply({ embeds: [embed] }).catch(( err => { } ))
                    break;
                }
                case "add": {
                    const user = interaction.options.getUser("user");
                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    const role = interaction.options.getRole("role");
                    if (!role) {
                        const embed = new MessageEmbed()
                            .setTitle(":x: No Role!")
                            .setDescription(`Could not find that role!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ embeds: [embed] }).catch(( err => { } ))
                        return;
                    } else {
                        memberTarget.roles.add(role).catch(( err => { } ))
                        const embed = new MessageEmbed()
                            .setTitle(":white_check_mark: Role granted!")
                            .setDescription(`Gave the role ${role} to ${user}!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ embeds: [embed] }).catch(( err => { } ))
                    }
                    break;
                }
                case "remove": {
                    const user = interaction.options.getUser("user");
                    let memberTarget = interaction.guild.members.cache.get(user.id);
                    const role = interaction.options.getRole("role");
                    if (!role) {
                        const embed = new MessageEmbed()
                            .setTitle(":x: No Role!")
                            .setDescription(`Could not find a role with the name **${roleName}**!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ embeds: [embed] }).catch(( err => { } ))
                        return;
                    } else {
                        memberTarget.roles.remove(role).catch(( err => { } ))
                        const embed = new MessageEmbed()
                            .setTitle(":white_check_mark: Role removed!")
                            .setDescription(`Removed the role ${role} from ${user}!`)
                            .setColor(COLOR_MAIN)
                            
                        interaction.reply({ embeds: [embed] }).catch(( err => { } ))
                    }
                    break;
                }
            }

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: channel`)] }).catch(( err => { } ))
            return;
        }
    }
}