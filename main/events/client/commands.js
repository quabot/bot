const consola = require('consola');
const { MessageEmbed } = require('discord.js');
const { color } = require('../../structures/settings.json');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.customId === "events") return;

        const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
        if (!interaction.isCommand()) {
            if (interaction.isSelectMenu()) {
                consola.info(`${interaction.customId} was selected`);
            }
            if (interaction.isModalSubmit()) {
                consola.info(`${interaction.customId} was submitted`);
            }
            client.guilds.cache.get('957024489638621185').channels.cache.get('957024582794104862').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${interaction.customId}** in **${interaction.guild.name}**`)] }).catch((err => { }));
        }
        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }) && client.commands.delete(interaction.commandName);

            if (command.permission) {
                if (!interaction.member.permissions.has(command.permission)) {
                    return interaction.reply({ content: `You do not have the required permissions for this command: \`${interaction.commandName}\`.\nYou need the permission: \`${command.permission}\` to do that`, ephemeral: true })
                }
            }

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        ticketCategory: "none",
                        ticketClosedCategory: "none",
                        ticketEnabled: true,
                        levelRewards: [],
                        ticketStaffPing: true,
                        ticketTopicButton: true,
                        ticketSupport: "none",
                        ticketId: 1,
                        ticketLogs: true,
                        ticketChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                        suggestChannelID: "none",
                        funCommands: [
                            '8ball',
                            'brokegamble',
                            'coin',
                            'quiz',
                            'reddit',
                            'rps',
                            'type'
                        ],
                        infoCommands: [
                            'roles',
                            'serverinfo',
                            'userinfo'
                        ],
                        miscCommands: [
                            'avatar',
                            'members',
                            'random',
                            'servericon'
                        ],
                        moderationCommands: [
                            'ban',
                            'clear-punishment',
                            'find-punishment',
                            'kick',
                            'tempban',
                            'timeout',
                            'unban',
                            'untimeout',
                            'warn'
                        ],
                        managementCommands: [
                            'clear',
                            'message',
                            'poll',
                            'reactionroles'
                        ],
                        logsuggestChannelID: "none",
                        funCommands: [
                            '8ball',
                            'brokegamble',
                            'coin',
                            'quiz',
                            'reddit',
                            'rps',
                            'type'
                        ],
                        infoCommands: [
                            'roles',
                            'serverinfo',
                            'userinfo'
                        ],
                        miscCommands: [
                            'avatar',
                            'members',
                            'random',
                            'servericon'
                        ],
                        moderationCommands: [
                            'ban',
                            'clear-punishment',
                            'find-punishment',
                            'kick',
                            'tempban',
                            'timeout',
                            'unban',
                            'untimeout',
                            'warn'
                        ],
                        managementCommands: [
                            'clear',
                            'message',
                            'poll',
                            'reactionroles'
                        ],
                        logPollChannelID: "none",
                        logSuggestChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        leaveChannelID: "none",
                        levelChannelID: "none",
                        funEnabled: true,
                        infoEnabled: true,
                        miscEnabled: true,
                        moderationEnabled: true,
                        managementEnabled: true,
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        modEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        roleEnabled: false,
                        mainRole: "none",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        membersChannel: "none",
                        membersMessage: "Members: {count}",
                        memberEnabled: true
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            }).clone().catch(function (err) { });

            const alwaysOn = ['level', 'music', 'suggest', 'ticket', 'config', 'dashboard', 'credits', 'help', 'info', 'ping', 'status', 'user'];
            const enabled = alwaysOn.concat(guildDatabase.funCommands, guildDatabase.infoCommands, guildDatabase.miscCommands, guildDatabase.moderationCommands, guildDatabase.managementCommands)

            if (!enabled.includes(command.name)) {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                    return interaction.reply({ content: `That command is disabled.`, ephemeral: true }).catch((err => { }));
                } else {
                    return interaction.reply({ content: `That command is disabled. You can re-enable it [on our dashboard](https://dashboard.quabot.net).`, ephemeral: true }).catch((err => { }));
                }

                return;
            }

            command.execute(client, interaction, color);
            if (!command.name) return;
            consola.info(`/${command.name} was used`);
            client.guilds.cache.get('957024489638621185').channels.cache.get('957024490318094369').send({ embeds: [new MessageEmbed().setDescription(`**${interaction.user.username}#${interaction.user.discriminator}** used **${command.name}** in **${interaction.guild.name}**`)] }).catch((err => { }))

            // alert system
            const GlobalUser = require('../../structures/schemas/GlobalUser');
            const userDatabase = await GlobalUser.findOne({
                userId: interaction.user.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new GlobalUser({
                        userId: interaction.user.id,
                        updateNotify: true,
                        lastNotify: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            }).clone().catch(function (err) { });

            if (!userDatabase) return;

            let lastNotif = userDatabase.lastNotify;

            if (userDatabase.updateNotify === false) return;

            if (lastNotif !== "none" || lastNotif !== undefined) {
                lastNotif = parseInt(lastNotif);
                lastNotif = lastNotif;

                let newNotif = 1655924671878; // SET THIS TO THE TIME THE NEW ANNOUNCEMENT CAME OUT (get it with new Date().getTime())

                if (lastNotif > newNotif) return;
            }

            await userDatabase.updateOne({
                lastNotify: new Date().getTime()
            });

            interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`> ${interaction.user}, new alert: QuaBot v3.0.4 has been released! [Changes](https://discord.gg/dWQpJBegXv)`)
                        .setColor(color)
                ],
                components: [new MessageActionRow({
                    components: [new MessageButton({
                        style: 'PRIMARY',
                        label: 'Mark as read',
                        customId: "notifRead"
                    })]
                })]
            }).catch((err => { }))
        }
    }
}