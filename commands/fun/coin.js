const { MessageEmbed } = require('discord.js');

const { coin, empty3 } = require('../../embeds/fun');
const { error } = require('../../embeds/general');

module.exports = {
    name: "coin",
    description: "Flip a coin.",
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [coin] }).catch(err => console.log("Error!"));
            const options = ['Heads', 'Tails'];
            const random = options[Math.floor(Math.random() * options.length)];
            empty3.setTitle(`🪙 ${random}!`);
            setTimeout(() => interaction.editReply({ embeds: [empty3] }).catch(err => console.log("err")), 2000);
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: coin`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}