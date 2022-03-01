const { MessageEmbed } = require('discord.js');

const { COLOR_MAIN } = require('../../files/colors.json');
const { error } = require('../../embeds/general');

module.exports = {
    name: "wiki",
    description: "QuaBot official wiki page.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const wiki = new MessageEmbed()
                .setColor(COLOR_MAIN)
                .setDescription(`Go to our wiki [here.](https://wiki.quabot.net/#/)`);
            interaction.reply({ embeds: [wiki] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: servers`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
