const { MessageEmbed } = require("discord.js");

module.exports = {
    value: "fun_commands",
    execute(interaction, client, color) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Fun Commands`)
                    .setDescription(`Play a game, get a meme or ask a question, these are the fun commands.
                    **/8ball** - Ask a question, get an answer.
                    **/brokegamble** - Gamble, but without money.
                    **/coin** - Flip a coin.
                    **/quiz** - Play a quiz.
                    **/reddit** - Get memes or cat and dog images.
                    **/rps** - Play a game of rock, paper, scissors.
                    **/type** - Play a speed-typing game.`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ], ephemeral: true
        });
    }
}