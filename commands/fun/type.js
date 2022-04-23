const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "type",
    description: "Play a speed-typing game.",
    async execute(client, interaction, color) {
        try {

            const listSentences = require('../../../../Discord Bot/structures/files/sentences.json');
            const randomSentence = listSentences[Math.floor(Math.random() * listSentences.length)];
            const startTime = new Date().getTime();

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Type this sentence within 15 seconds!")
                        .addField("Sentence", `${randomSentence}`)
                        .setColor(color)
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('typeStop')
                                .setLabel('Stop')
                                .setStyle('SECONDARY')
                        )
                ]
            }).catch(err => console.log(err));

            const filter = m => m.author === interaction.user;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });
            collector.on('collect', m => {
                const seconds = new Date(new Date().getTime() - startTime).getSeconds();
                collector.stop();
                if (m.content === randomSentence) {
                    m.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Correct!")
                                .setDescription(`${m.author} typed the sentence in \`${seconds}\` seconds!`)
                                .addField("Sentence", `${randomSentence}`)
                                .setColor("GREEN")
                        ],
                    }).catch(err => console.log(err));
                } else {
                    m.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Incorrect!")
                                .setDescription(`${m.author} failed to type the correct sentence in \`${seconds}\` seconds!`)
                                .addField("Sentence", `${randomSentence}`)
                                .addField("Your Answer", `${m.content}`)
                                .setColor("RED")
                        ],
                    }).catch(err => console.log(err));
                }
            });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}