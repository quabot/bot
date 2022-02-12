const { error } = require('../../embeds/general');
const { invite } = require('../../embeds/info');

module.exports = {
    name: "invite",
    description: "Invite quabot.",
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [invite] }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}