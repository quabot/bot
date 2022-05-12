const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "find-punishment",
    description: 'Find a punsihment of a user.',
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "The user you want to find a punishment for.",
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
            description: "What punishment to use.",
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
                    }).catch(( err => { } ))

                    if (!warns.active) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`That warn has been cleared.`)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

                    var timestamp = parseInt(warns.warnTime);
                    var date = new Date(timestamp);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`Warning for ${user.user.username}`)
                                .addField("User", `${user}`, true)
                                .addField("Reason", `${warns.warnReason}`, true)
                                .addField("Warned by", `<@${warns.warnedBy}>`, true)
                                .addField("Warned at", `${year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                                .addField("Warn ID", `${warns.warnId}`, true)
                                .addField("Warn Channel", `<#${warns.warnChannel}>`, true)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

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
                    }).catch(( err => { } ))

                    if (!bans.active) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`That ban has been cleared.`)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

                    var timestamp = parseInt(bans.banTime);
                    var date = new Date(timestamp);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`Ban for ${user.user.username}`)
                                .addField("User", `${user}`, true)
                                .addField("Reason", `${bans.banReason}`, true)
                                .addField("Banned by", `<@${bans.bannedBy}>`, true)
                                .addField("Banned at", `${year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                                .addField("Bans ID", `${bans.banId}`, true)
                                .addField("Ban Channel", `<#${bans.banChannel}>`, true)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

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
                    }).catch(( err => { } ))

                    if (!kicks.active) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`That kick has been cleared.`)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

                    var timestamp = parseInt(kicks.kickTime);
                    var date = new Date(timestamp);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`Kick for ${user.user.username}`)
                                .addField("User", `${user}`, true)
                                .addField("Reason", `${kicks.kickReason}`, true)
                                .addField("Kicked by", `<@${kicks.kickedBy}>`, true)
                                .addField("Kicked at", `${year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                                .addField("Kick ID", `${kicks.kickId}`, true)
                                .addField("Kick Channel", `<#${kicks.kickChannel}>`, true)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

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
                    }).catch(( err => { } ))

                    if (!timeouts.active) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`That timeout has been cleared.`)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

                    var timestamp = parseInt(timeouts.timedoutTime);
                    var date = new Date(timestamp);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`Timeout for ${user.user.username}`)
                                .addField("User", `${user}`, true)
                                .addField("Reason", `${timeouts.timeoutReason}`, true)
                                .addField("Timed out by", `<@${timeouts.timedoutBy}>`, true)
                                .addField("Timed out at", `${year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                                .addField("Timeout ID", `${timeouts.timeoutId}`, true)
                                .addField("Timeout Channel", `<#${timeouts.timeoutChannel}>`, true)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ))

                    break;

                default:
                    break;
            }


        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}