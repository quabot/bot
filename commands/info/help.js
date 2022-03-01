const { error } = require('../../embeds/general');
const { main } = require('../../embeds/info');
const { help } = require('../../interactions/info');

module.exports = {
    name: "help",
    description: "List of all quabot commands.",
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [main], components: [help] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log(err));;
            return;
        }
    }
}