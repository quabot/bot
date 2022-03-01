const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { empty, empty2 } = require('../../embeds/fun');
const options = require('../../files/sentences.json');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "type",
    description: "Play a typing game.",
    async execute(client, interaction) {
        try {
            const random = options[Math.floor(Math.random() * options.length)];
            empty.setTitle("Type this sentence within 15 seconds.").setDescription(`\`${random}\``);
            interaction.reply({ embeds: [empty] }).catch(err => console.log(err));
            const startTime = new Date().getTime();
            const filter = m => interaction.user === m.author;
            const collector = interaction.channel.createMessageCollector({ time: 15000, filter: filter });
            collector.on('collect', m => {
                empty2.setTitle("❌ Wrong sentence!");
                if (m.content.length > 1024) return m.reply({ embeds: [empty2], allowedMentions: { repliedUser: false } }).catch(err => console.log(err));;
                if (m.content === random) {
                    const timeSpent = new Date().getTime() - startTime;
                    const timeDate = new Date(timeSpent);
                    const seconds = timeDate.getSeconds();
                    const embed =  new MessageEmbed().setTitle("✅ Correct!").addField(`Sentence`, `\`${random}\``).addField("Time Spent", `\`${seconds}\` seconds`).setColor(COLOR_MAIN);
                    m.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(err => console.log(err));;
                    collector.stop();
                    return;
                } else {
                    const timeSpent = new Date().getTime() - startTime;
                    const timeDate = new Date(timeSpent);
                    const seconds = timeDate.getSeconds();
                    empty2.addField("Sentence", `${random}** **`).addField("Your Answer", `${m.content}** **`).addField("Time Spent", `\`${seconds}\` seconds`);
                    m.reply({ embeds: [empty2], allowedMentions: { repliedUser: false } }).catch(err => console.log(err));;
                    collector.stop();
                    return;
                }
            });
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: type`)] }).catch(err => console.log(err));;
            return;
        }
    }
}