const discord = require('discord.js');
const colors = require('../../files/colors.json');

const rpsMessage = new discord.MessageEmbed()
    .setTitle("Rock, Paper, Scissors!")
    .setDescription("Please react with rock :rock:, paper :newspaper: or scissors :scissors:!")
    .setColor(colors.COLOR);
const resultTieRock = new discord.MessageEmbed()
    .setTitle("It's a tie! :worried:")
    .setDescription("We both picked 🪨!")
    .setColor(colors.COLOR);
const resultWinRock = new discord.MessageEmbed()
    .setTitle("You won! :white_check_mark:")
    .setDescription("You picked 🪨 and I picked ✂️!")
    .setColor(colors.COLOR);
const resultLoseRock = new discord.MessageEmbed()
    .setTitle("You lost! :x:")
    .setDescription("You picked 🪨 and I picked 📰!")
    .setColor(colors.COLOR);
const resultTieScissors = new discord.MessageEmbed()
    .setTitle("It's a tie! :worried:")
    .setDescription("We both picked ✂️!")
    .setColor(colors.COLOR);
const resultWinScissors = new discord.MessageEmbed()
    .setTitle("You won! :white_check_mark:")
    .setDescription("You picked ✂️ and I picked 📰!")
    .setColor(colors.COLOR);
const resultLoseScissors = new discord.MessageEmbed()
    .setTitle("You lost! :x:")
    .setDescription("You picked ✂️ and I picked 🪨!")
    .setColor(colors.COLOR);
const resultTiePaper = new discord.MessageEmbed()
    .setTitle("It's a tie! :worried:")
    .setDescription("We both picked 📰!")
    .setColor(colors.COLOR);
const resultWinPaper = new discord.MessageEmbed()
    .setTitle("You won! :white_check_mark:")
    .setDescription("You picked 📰 and I picked 🪨!")
    .setColor(colors.COLOR);
const resultLosePaper = new discord.MessageEmbed()
    .setTitle("You lost! :x:")
    .setDescription("You picked 📰 and I picked ✂️!")
    .setColor(colors.COLOR);
const cancelled = new discord.MessageEmbed()
    .setDescription(":x: Cancelled! You failed to respond in time!")
    .setColor(colors.COLOR);
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "rps",
    description: "Play rock, paper, scissors.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const choices = ['🪨', '✂️', '📰'];
            const me = choices[Math.floor(Math.random() * choices.length)];

            let msg = await interaction.reply({ embeds: [rpsMessage], fetchReply: true }).then(m => {
                m.react('🪨');
                m.react('✂️');
                m.react('🧻');
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '🪨' || reaction.emoji.name === '✂️' || reaction.emoji.name === '🧻' && user.id === interaction.user.id;
                };
                const collector = m.createReactionCollector({ filter, time: 20000 });
                collector.on('collect', (reaction, user) => {
                    if (user.bot) return;
                    collector.stop()
                    if (reaction.emoji.name === '🪨') {
                        if (me === '🪨') {
                            interaction.followUp({ embeds: [resultTieRock] });
                        }
                        if (me === '✂️') {
                            interaction.followUp({ embeds: [resultWinRock] });
                        }
                        if (me === '🧻') {
                            interaction.followUp({ embeds: [resultLoseRock] });
                        }
                    }
                    if (reaction.emoji.name === '✂️') {
                        if (me === '🪨') {
                            interaction.followUp({ embeds: [resultLoseScissors] });
                        }
                        if (me === '✂️') {
                            interaction.followUp({ embeds: [resultTieScissors] });
                        }
                        if (me === '🧻') {
                            interaction.followUp({ embeds: [resultWinScissors] });
                        }
                    }
                    if (reaction.emoji.name === '🧻') {
                        if (me === '🪨') {
                            interaction.followUp({ embeds: [resultWinPaper] });
                        }
                        if (me === '✂️') {
                            interaction.followUp({ embeds: [resultLosePaper] });
                        }
                        if (me === '🧻') {
                            interaction.followUp({ embeds: [resultTiePaper] });
                        }
                    }
                });
            });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}