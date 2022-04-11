const { MessageEmbed } = require('discord.js');

const { error, added } = require('../embeds/general');
const { kickImpossible } = require('../embeds/moderation');
const { COLOR_MAIN } = require('../../files/colors.json');


module.exports = {
    name: "untimeout",
    description: "Untimeout a user.",
    permission: "MODERATE_MEMBERS",
    options: [
        {
            name: "user",
            description: "User to un timeout.",
            type: "USER",
            required: true,
        },
    ],
    async execute(client, interaction) {
        try {
            const user = interaction.options.getMember('user');

            const userUnbanned = new MessageEmbed()
                .setTitle(":white_check_mark: User Un Timed Out!")
                .setDescription(`<@${user}> was untimedout.`)
                .setColor(COLOR_MAIN)
                .setFooter(`User-ID: ${user.id}`);
                user.timeout(1, `Timeout was removed.}`).catch(err => {
                    interaction.channel.send({ embeds: [kickImpossible] }).catch(err => console.log(err));
                    let reason = ":x: Timeout failed.";
                    return;
                });

            interaction.reply({ embeds: [userUnbanned] }).catch(err => console.log(err));

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: ban`)] }).catch(err => console.log(err));;
            return;
        }
    }
}