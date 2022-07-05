const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ban",
    description: 'Ban a user.',
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "Who should QuaBot ban?",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Why should that user be banned?",
            type: "STRING",
            required: false,
        },
        {
            name: "private",
            description: "Should QuaBot hide this command being performed?",
            type: "BOOLEAN",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        let member = interaction.options.getMember('user');
        let reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : "No reason given";
        let private = interaction.options.getBoolean('private') ? true : false;
        if (reason.length > 1000) reason = "No reason specified.";
        let didBan = true;

        if (!member) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<:error:990996645913194517> Unspecified argument")
                        .setDescription(`Please specify a user to ban`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.id === interaction.member.id) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<:error:990996645913194517> What is wrong with you?")
                        .setDescription(`You can't ban yourself!`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<:error:990996645913194517> Insufficcient permissions")
                        .setDescription(`You cannot ban a user with roles higher than your own`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (member.roles.highest.rawPosition > interaction.guild.members.cache.get(client.user.id).roles.highest.rawPosition) {
            didBan = false;
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<:error:990996645913194517> Insufficcient permissions")
                        .setDescription(`QuaBot does not have permission to ban that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral: private
            }).catch((err => { }))
        }

        if (didBan) {
            if (!private) {
                member.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`<:error:990996645913194517> You were banned`)
                            .setDescription(`You were banned from **${interaction.guild.name}**
                    **Banned by**: ${interaction.user}
                    **Reason**: ${reason}`)
                            .setTimestamp()
                            .setColor(color)
                    ]
                }).catch(err => { });
            }
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`<:online:938818583868366858> User banned`)
                        .setDescription(`**User**: ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Ban-ID", value: `Currently unavailable`, inline: true },
                            { name: "Reason", value: `${reason}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                ], ephemeral: private
            }).catch((err => { }))
        }

        member.ban({ reason: reason }).catch(err => {
            didBan = false;
            if (err.code === 50013) {
                interaction.deleteReply();
                return interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<:error:990996645913194517> Insufficcient permissions")
                            .setDescription(`QuaBot does not have permission to ban that user - try moving the QuaBot role above all others`)
                            .setColor(color)
                    ], ephemeral: private
                }).catch((err => { }))
            }
        });
    }
}