const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ban",
    description: 'Ban a user.',
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "The user you want to ban.",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "Why you want to ban that user.",
            type: "STRING",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        try {

            let member = interaction.options.getMember('user');
            let reason = interaction.options.getString('reason');
            if (!reason) reason = "No reason specified.";

            if (!member) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please give a member to ban.`)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

            // ban and error codes
            member.ban({ reason: reason }).catch(err => {
                if (err.code === 50013) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`I do not have permission to ban that user.`)
                                .setColor(color)
                        ]
                    }).catch(err => console.log(err));
                    return;
                }
            })

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`${client.user.username}'s Ping`)
                        .setDescription(`\`${client.ws.ping}ms\``)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}