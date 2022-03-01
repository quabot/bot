const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "find",
    description: "Find punishments.",
    permisison: "KICK_MEMBERS",
    options: [
        {
            type: 1,
            name: "by-id",
            description: "Find a punishment by id.",
            options: [
                {
                    type: "STRING",
                    name: "type",
                    description: "Type of punishment.",
                    required: true,
                    choices: [
                        { name: "warn", value: "warn" },
                        { name: "kick", value: "kick" },
                        { name: "ban", value: "ban" },
                        { name: "timeout", value: "timeout" }
                    ]
                },
                {
                    type: "INTEGER",
                    name: "id",
                    description: "The punishment id.",
                    required: true
                },
                {
                    type: "USER",
                    name: "user",
                    description: "The user who was punished.",
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: "by-user",
            description: "COMING SOON",
        },
    ],
    async execute(client, interaction) {
        try {
            const { options } = interaction;
            const Sub = options.getSubcommand();

            switch (Sub) {
                case "by-id": {
                    const type = interaction.options.getString('type');
                    const id = interaction.options.getInteger('id');
                    const user = interaction.options.getMember('user');

                    if (type === "warn") {
                        const Warns = require('../../schemas/WarnSchema');
                        const warnDB = await Warns.findOne({
                            userId: user.id,
                            guildId: interaction.guild.id,
                            warnId: id,
                        }, (err, user) => {
                            if (err) console.error(err);
                            if (!user) {
                                console.log("sad there's no warn with that id :((")
                            }
                        }).clone().catch(function (err) { console.log(err) });

                        if (!warnDB) return interaction.reply({ embeds: [new MessageEmbed().setDescription("Could not find a warn with that id for <@" + user + ">!").setColor(COLOR_MAIN)] }).catch(err => console.log("err uwu"));


                        if (!warnDB) return interaction.reply({ embeds: [notFound] });

                        var timestamp = parseInt(warnDB.warnTime);
                        var date = new Date(timestamp);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var seconds = date.getSeconds();

                        const infoEmbed = new MessageEmbed()
                            .setTitle("Warn Info")
                            .addField("User", `${user}`, true)
                            .addField("Reason", `${warnDB.warnReason}`, true)
                            .addField("Warned by", `<@${warnDB.warnedBy}>`, true)
                            .addField("Warned at", `${year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                            .addField("Warn ID", `${warnDB.warnId}`, true)
                            .addField("Warn Channel", `<#${warnDB.warnChannel}>`, true)
                            .setColor(COLOR_MAIN)
                            .setTimestamp(warnDB.warnTime)
                        if (warnDB.active === false) infoEmbed.setDescription("⛔ This warning has been removed.")
                        interaction.reply({ embeds: [infoEmbed] });
                    }

                    if (type === "kick") {
                        const Kicks = require('../../schemas/KickSchema');
                        const kickDB = await Kicks.findOne({
                            userId: user.id,
                            guildId: interaction.guild.id,
                            kickId: id,
                        }, (err, user) => {
                            if (err) console.error(err);
                            if (!user) {
                                console.log("sad there's no warn with that id :((")
                            }
                        }).clone().catch(function (err) { console.log(err) });

                        if (!kickDB) return interaction.reply({ embeds: [new MessageEmbed().setDescription("Could not find a kick with that id for <@" + user + ">!").setColor(COLOR_MAIN)] }).catch(err => console.log("err uwu"));

                        const infoEmbed = new MessageEmbed()
                            .setTitle("Kick Info")
                            .addField("User", `${user}`, true)
                            .addField("Reason", `${kickDB.kickReason}`, true)
                            .addField("Kicked by", `<@${kickDB.kickedBy}>`, true)
                            .addField("Kick ID", `${kickDB.kickId}`, true)
                            .addField("Kick Channel", `<#${kickDB.kickChannel}>`, true)
                            .setColor(COLOR_MAIN)
                        if (kickDB.active === false) infoEmbed.setDescription("⛔ This warning has been removed.")
                        interaction.reply({ embeds: [infoEmbed] });
                    }

                    if (type === "ban") {
                        const Bans = require('../../schemas/BanSchema');
                        const banDB = await Bans.findOne({
                            userId: user.id,
                            guildId: interaction.guild.id,
                            banId: id,
                        }, (err, user) => {
                            if (err) console.error(err);
                            if (!user) {
                                console.log("sad there's no warn with that id :((")
                            }
                        }).clone().catch(function (err) { console.log(err) });

                        if (!banDB) return interaction.reply({ embeds: [new MessageEmbed().setDescription("Could not find a ban with that id for <@" + user + ">!").setColor(COLOR_MAIN)] }).catch(err => console.log("err uwu"));

                        var timestamp = parseInt(banDB.banTime);
                        var date = new Date(timestamp);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var seconds = date.getSeconds();

                        const infoEmbed = new MessageEmbed()
                            .setTitle("Ban Info")
                            .addField("User", `${user}`, true)
                            .addField("Reason", `${banDB.banReason}`, true)
                            .addField("Warned by", `<@${banDB.bannedBy}>`, true)
                            .addField("Warned at", `${year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                            .addField("Warn ID", `${banDB.banId}`, true)
                            .addField("Warn Channel", `<#${banDB.banChannel}>`, true)
                            .setColor(COLOR_MAIN)
                            .setTimestamp(banDB.banTime)
                        if (banDB.active === false) infoEmbed.setDescription("⛔ This warning has been removed.")
                        interaction.reply({ embeds: [infoEmbed] });
                    }

                    if (type === "timeout") {
                        const Timeouts = require('../../schemas/TimeoutSchema');
                        const timeoutDB = await Timeouts.findOne({
                            userId: user.id,
                            guildId: interaction.guild.id,
                            timeoutId: id,
                        }, (err, user) => {
                            if (err) console.error(err);
                            if (!user) {
                                console.log("sad there's no warn with that id :((")
                            }
                        }).clone().catch(function (err) { console.log(err) });

                        if (!timeoutDB) return interaction.reply({ embeds: [new MessageEmbed().setDescription("Could not find a timeout with that id for <@" + user + ">!").setColor(COLOR_MAIN)] }).catch(err => console.log("err uwu"));

                        var timestamp = parseInt(timeoutDB.timedoutTime);
                        var date = new Date(timestamp);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var seconds = date.getSeconds();

                        const infoEmbed = new MessageEmbed()
                            .setTitle("Timeout Info")
                            .addField("User", `${user}`, true)
                            .addField("Reason", `${timeoutDB.timeoutReason}`, true)
                            .addField("Timed Out by", `<@${timeoutDB.timedoutBy}>`, true)
                            .addField("Timed Out at", `${year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds}`, true)
                            .addField("Timeout ID", `${timeoutDB.timeoutId}`, true)
                            .addField("Timeout Channel", `<#${timeoutDB.timeoutChannel}>`, true)
                            .setColor(COLOR_MAIN)
                            .setTimestamp(timeoutDB.timedoutTime)
                        if (timeoutDB.active === false) infoEmbed.setDescription("⛔ This warning has been removed.")
                        interaction.reply({ embeds: [infoEmbed] });
                    }

                    break;
                }
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log(err));;
            return;
        }
    }
}