const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "profile",
    description: 'Get a user\'s profile.',
    options: [
        {
            name: "user",
            type: "USER",
            required: false,
            description: "User to view the profile of."
        }
    ],
    async execute(client, interaction, color) {
        try {

            let user = interaction.options.getMember('user');
            if (!user) user = interaction.member;

            // get the database and failsaves
            const User = require('../../structures/schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: user.id,
                guildId: interaction.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: user.id,
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        banCount: 0,
                        kickCount: 0,
                        timeoutCount: 0,
                        warnCount: 0,
                        updateNotify: true,
                        lastNotify: "none",
                        afk: false,
                        afkMessage: "none",
                        bio: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!userDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Changed the database! Please run that command again.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch(( err => { } ))

            // get the bio and send the message.
            let bio = userDatabase.bio;
            if (bio === "none") bio = "No bio configured. This can be done with `/user bio`."
            let notifs = `${userDatabase.updateNotify}`;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`${user.user.username}'s profile`)
                        .setThumbnail(user.avatarURL({ dynamic: true }))
                        .addField('User <:MembersIcon:959741227689988196>', `${user.user}`, true)
                        .addField('Discriminator <:ChannelIcon:959741807380557845>', `\`#${user.user.discriminator}\``, true)
                        .addField('ID <:IdIcon:960591936840957962>', `\`${user.user.id}\``, true)
                        .addField('Joined server on <:AddIcon:963355747209576498>', `<t:${Math.round(user.joinedTimestamp / 1000)}:R>`, true)
                        .addField('Joined Discord on <:AddIcon:963355747209576498>', `<t:${parseInt(user.user.createdTimestamp / 1000)}:R>`, true)
                        .setFooter(`${user.user.username}#${user.user.discriminator}`, user.user.avatarURL({ dynamic: true }))
                        .setDescription(`${bio}`)
                        .addFields(
                            { name: "Update Notifications", value: `${notifs.replace("true", "Enabled").replace("false", "Disabled")}`, inline: true }
                        )
                        .setColor(color)
                        .setTimestamp()
                ]
            }).catch(( err => { } ))

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
