const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "warn",
    description: 'Warn a user.',
    permission: "MANAGE_MESSAGES",
    options: [
        {
            name: "user",
            description: "The user you want to ban.",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Why you want to warn that user.",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction, color) {
        try {

            let member = interaction.options.getMember('user');
            let reason = interaction.options.getString('reason');
            if (reason.length > 1000) reason = "No reason specified.";

            if (!member) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a member to warn.`)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

            member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`You were warned`)
                        .setDescription(`You were warned on one of your servers, **${interaction.guild.name}**.
                        **Warned by:** ${interaction.user}
                        **Reason:** ${reason}`)
                        .setTimestamp()
                        .setColor(color)
                ]
            }).catch(err => { if (err.code !== 50007) console.log(err) });

            const User = require('../../structures/schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: member.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: member.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        banCount: 0,
                        kickCount: 0,
                        timeoutCount: 0,
                        warnCount: 1,
                        updateNotify: false,
                        notifOpened: false,
                        afk: false,
                        afkMessage: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (userDatabase) {
                await userDatabase.updateOne({
                    warnCount: userDatabase.warnCount + 1,
                });
            }

            let warns;

            if (userDatabase) warns = userDatabase.warnCount + 1;

            if (!warns) warns = 1;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Warned`)
                        .setDescription(`**User:** ${member}\n**Reason:** ${reason}`)
                        .setColor(color)
                        .setFooter(`Warn-Id: ${warns}`)
                ]
            }).catch(err => console.log(err));

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
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        logEnabled: true,
                        levelEnabled: false,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        roleEnabled: false,
                        mainRole: "Member",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            const Warns = require('../../structures/schemas/WarnSchema');
            const newWarn = new Warns({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                userId: member.id,
                warnReason: reason,
                warnTime: new Date().getTime(),
                warnId: warns,
                warnedBy: interaction.user.id,
                warnChannel: interaction.channel.id,
                active: true,
            });
            newWarn.save()
                .catch(err => {
                    console.log(err);
                    interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}