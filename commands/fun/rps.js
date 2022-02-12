const { MessageEmbed } = require('discord.js');

const { rpsButton } = require('../../interactions/fun');
const { error } = require('../../embeds/general');
const { rps } = require('../../embeds/fun');

module.exports = {
    name: "rps",
    description: "Play rock, paper, scissors.",
    async execute(client, interaction) {
        try {
            const message = await interaction.reply({ embeds: [rps], components: [rpsButton], fetchReply: true }).catch(err => console.log("Error!"));
            const options = ['rock', 'paper', 'scissors'];
            const random = options[Math.floor(Math.random() * options.length)];
            const rpsSchema = require('../../schemas/rpsSchema');
            const newRps = new rpsSchema({
                guildId: interaction.guild.id,
                userId: interaction.user.id,
                result: random,
                messageId: message.id,});
            newRps.save().catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: rps`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}