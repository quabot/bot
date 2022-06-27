const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    id: "rps-scissors",
    async execute(interaction, client, color) {

        const validChoices = ['rock', 'paper', 'scissors'];

        const User = require('../../../structures/schemas/UserSchema');
        const UserDatabase = await User.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        }, (err, user) => {
            if (err) console.log(err);
            if (!user) {
                const newUser = new User({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    quizScore: 0,
                    quizWins: 0,
                    quizLoses: 0,
                    typeScore: 0,
                    typeWins: 0,
                    typeLoses: 0,
                    rpsScore: 0,
                    rpsWins: 0,
                    rpsLoses: 0,
                });
                newUser.save();
            }
        }).clone().catch((err => { }));

        if (!UserDatabase) return;  

        switch (validChoices[Math.floor(Math.random() * validChoices.length)]) {
            case "scissors":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`It's a tie! We both picked scissors.`)
                            .setColor(color)
                            .addFields(
                                { name: "Score", value: `\`${UserDatabase.rpsScore}\``, inline: true },
                                { name: "Total Wins", value: `\`${UserDatabase.rpsWins}\``, inline: true },
                                { name: "Total Loses", value: `\`${UserDatabase.rpsLoses}\``, inline: true }
                            )
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle('SECONDARY'),
                            )
                            
                    ]
                }).catch((err => { }))

                break;

            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You lost! The correct answer was **paper**, ${interaction.user} picked **scissors**!`)
                            .setColor("RED")
                            .addFields(
                                { name: "Score", value: `\`${UserDatabase.rpsScore - 1}\``, inline: true },
                                { name: "Total Wins", value: `\`${UserDatabase.rpsWins}\``, inline: true },
                                { name: "Total Loses", value: `\`${UserDatabase.rpsLoses + 1}\``, inline: true }
                            )
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle('SECONDARY'),
                            )
                    ]
                }).catch((err => { }));

                await UserDatabase.updateOne({
                    rpsScore: UserDatabase.rpsScore - 1,
                    rpsloses: UserDatabase.rpsLoses + 1
                });
                
                break;

            case "rock":
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You won! The correct answer was **rock**, ${interaction.user} picked **scissors**!`)
                            .setColor("GREEN")
                            .addFields(
                                { name: "Score", value: `\`${UserDatabase.rpsScore + 1}\``, inline: true },
                                { name: "Total Wins", value: `\`${UserDatabase.rpsWins + 1}\``, inline: true },
                                { name: "Total Loses", value: `\`${UserDatabase.rpsLoses}\``, inline: true }
                            )
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('rps-replay')
                                    .setLabel('Retry')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('stop')
                                    .setLabel('Stop')
                                    .setStyle('SECONDARY'),
                            )
                    ]
                }).catch((err => { }));
                
                await UserDatabase.updateOne({
                    rpsScore: UserDatabase.rpsScore + 1,
                    rpsWins: UserDatabase.rpsWins + 1
                });

                break;
        }
    }
}