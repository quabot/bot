const { MessageEmbed } = require('discord.js');
const { meme } = require('memejs');

const { memeScan, emptyReddit } = require('../../embeds/fun');
const { error } = require('../../embeds/general');

module.exports = {
    name: "meme",
    description: "Get a random meme.",
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [memeScan] }).catch(err => console.log("Error!"));
            meme('meme', function (err, data) {
                if (err) return interaction.editReply({ embeds: [error] }).catch(err => console.log("Error!"));
                emptyReddit.setTitle(`${data.title}`).setImage(`${data.url}`).setFooter(`r/${data.subreddit}`);
                interaction.editReply({ embeds: [emptyReddit] }).catch(err => console.log("Error!"));
            });
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: meme`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}