const { MessageEmbed } = require('discord.js');
const ms = require('ms');

const { error, added } = require('../../embeds/general');
const { noChannel } = require('../../embeds/management');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "lock",
    description: "Lock a channel.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "channel",
            description: "Channel to lock (when none is given, current channel is locked.",
            required: false,
            type: "CHANNEL",
        },
        {
            name: "duration",
            description: "Duration to lock the channel (when none is given, locked indefinetely)",
            required: false,
            type: "STRING",
        },
        {
            name: "reason",
            description: "Reason to lock the channel.",
            required: false,
            type: "STRING",
        },
    ],
    async execute(client, interaction) {
        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "none",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            let channel = interaction.options.getChannel('channel');
            if (!channel) channel = interaction.channel;
            let duration = interaction.options.getString('duration');
            if (!duration) duration = "12months";
            let reason = interaction.options.getString('reason');
            if (!reason) reason = "No reason specified.";

            const role = interaction.guild.roles.cache.find(role => role.id === `${guildDatabase.mainRole}`);

            if (channel.type === "GUILD_TEXT") {
                if (ms(duration)) {
                    if (role) channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false }).catch(err => console.log(err));
                    channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: false }).catch(err => console.log(err));
                    const locked = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔒 Channel locked!").addField("Locked by", `${interaction.user}`).addField("Duration", `${duration}`).addField("Reason", `${reason}`);
                    channel.send({ embeds: [locked] }).catch(err => console.log(err));
                    const reply = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔒 Channel locked!").setDescription(`Succesfully locked ${channel} for ${duration}.`);
                    interaction.reply({ ephemeral: true, embeds: [reply] }).catch(err => console.log(err));
                    setTimeout(function () {
                        if (role) channel.permissionOverwrites.edit(role, { SEND_MESSAGES: true }).catch(err => console.log(err));
                        channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: true }).catch(err => console.log(err));
                        const unlocked = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔓 Channel unlocked!").setDescription(`This channel was automatically unlocked after ${duration}.`);
                        channel.send({ embeds: [unlocked] }).catch(err => console.log(err));
                    }, ms(duration));
                } else {
                    if (role) channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false }).catch(err => console.log(err));
                    channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: false }).catch(err => console.log(err));
                    const locked = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔒 Channel locked!").addField("Locked by", `${interaction.user}`).addField("Reason", `${reason}`);
                    channel.send({ embeds: [locked] }).catch(err => console.log(err));
                    const reply = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔒 Channel locked!").setDescription(`Succesfully locked ${channel}.`);
                    interaction.reply({ ephemeral: true, embeds: [reply] }).catch(err => console.log(err));
                }
            } else if (channel.type === "GUILD_VOICE") {
                if (ms(duration)) {
                    if (role) channel.permissionOverwrites.edit(role, { CONNECT: false, SPEAK: false }).catch(err => console.log(err));
                    channel.permissionOverwrites.edit(interaction.guild.id, { CONNECT: false, SPEAK: false }).catch(err => console.log(err));
                    const reply = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔒 Voice Channel locked!").setDescription(`${channel}`).addField("Locked by", `${interaction.user}`).addField("Duration", `${duration}`).addField("Reason", `${reason}`);
                    interaction.reply({ embeds: [reply] }).catch(err => console.log(err));
                    setTimeout(function () {
                        if (role) channel.permissionOverwrites.edit(role, { CONNECT: true, SPEAK: true  }).catch(err => console.log(err));
                        channel.permissionOverwrites.edit(interaction.guild.id, { CONNECT: false, SPEAK: true  }).catch(err => console.log(err));
                        const unlocked = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔓 Voice channel unlocked!").setDescription(`${channel} was automatically unlocked after ${duration}.`);
                        interaction.channel.send({ embeds: [unlocked] }).catch(err => console.log(err));
                    }, ms(duration));
                } else {
                    if (role) channel.permissionOverwrites.edit(role, { CONNECT: false, SPEAK: false }).catch(err => console.log(err));
                    channel.permissionOverwrites.edit(interaction.guild.id, { CONNECT: false, SPEAK: false }).catch(err => console.log(err));
                    const reply = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔒 Voice Channel locked!").setDescription(`${channel}`).addField("Locked by", `${interaction.user}`).addField("Duration", `${duration}`).addField("Reason", `${reason}`);
                    interaction.reply({ embeds: [reply] }).catch(err => console.log(err));
                }
            } else {
                interaction.reply({ embeds: [noChannel] }).catch(err => console.log(err));
            }

            if (!guildDatabase) return;

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;

                const embed = new MessageEmbed()
                    .setColor(`PURPLE`)
                    .setTitle('🔒 Channel Locked')
                    .addField('Channel', `${channel}`)
                    .addField('Locked by', `${interaction.user}`)
                    .addField("Reason", `${reason}`)
                if (ms(duration)) embed.addField("Duration", `${duration}`);
                logChannel.send({ embeds: [embed] }).catch(err => console.log(err));
            } else {
                return;
            }

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            console.log(e)
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: lock`)] }).catch(err => console.log(err));
            return;
        }
    }
}