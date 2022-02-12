const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { pingGet } = require('../../embeds/info');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "ping",
    description: "Your ping.",
    async execute(client, interaction) {

        try {
            interaction.reply({ embeds: [pingGet] }).then(m => {
                pingGet.setTitle(`:white_check_mark: Your current ping is: **${client.ws.ping}ms**.`);
                interaction.editReply({ embeds: [pingGet] }).catch(err => console.log("Error!"));
            }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: nick`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
