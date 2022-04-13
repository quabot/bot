const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "clear-punishment",
    description: 'Clear a punsihment of a user.',
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "The user you want to clear a punishment for.",
            type: "USER",
            required: true,
        },
        {
            name: "id",
            description: "The punishment id.",
            type: "INTEGER",
            required: true,
        },
        {
            name: "punishment",
            description: "What punishment to clear.",
            type: "STRING",
            required: true,
            choices: [
                { name: "warn", value: "warn" },
                { name: "kick", value: "kick" },
                { name: "ban", value: "ban" },
                { name: "timeout", value: "timeout" }
            ]
        }
    ],
    async execute(client, interaction, color) {
        try {

            let user = interaction.options.getMember('user');
            let id = interaction.options.getInteger('id');
            let punishement = interaction.options.getString('punishment');

            switch (punishement) {
                case 'warn':
                    const Warns = require('../../structures/schemas/WarnSchema');
                    const warns = await Warns.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                        warnId: id
                    });

                    if (!warns) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Could not find that warning for ${user}.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Cleared the warning succesfully.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    await warns.updateOne({
                        active: false,
                    });
                    break;

                case 'ban':
                    const Bans = require('../../structures/schemas/BanSchema');
                    const bans = await Bans.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                        banId: id
                    });

                    if (!bans) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Could not find that ban for ${user}.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Cleared the ban succesfully.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    await bans.updateOne({
                        active: false,
                    });

                    break;

                case 'kick':
                    const Kicks = require('../../structures/schemas/KickSchema');
                    const kicks = await Kicks.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                        kickId: id
                    });

                    if (!kicks) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Could not find that kick for ${user}.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Cleared the kick succesfully.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    await kicks.updateOne({
                        active: false,
                    });

                    break;

                case 'timeout':
                    const Timeouts = require('../../structures/schemas/TimeoutSchema');
                    const timeouts = await Timeouts.findOne({
                        guildId: interaction.guild.id,
                        userId: user.id,
                        timeoutId: id
                    });

                    if (!timeouts) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Could not find that timeout for ${user}.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`Cleared the timeout succesfully.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));

                    await timeouts.updateOne({
                        active: false,
                    });

                    break;

                default:
                    break;
            }


        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}