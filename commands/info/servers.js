const { MessageEmbed } = require('discord.js');

const { COLOR_MAIN } = require('../../files/colors.json');
const { error } = require('../../embeds/general');
module.exports = {
    name: "servers",
    description: "Amount of servers.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const servers = new MessageEmbed()
                .setColor(COLOR_MAIN)
                .setDescription(`QuaBot is in \`${client.guilds.cache.size}\` servers.`);
            interaction.reply({ embeds: [servers] })
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: servers`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
