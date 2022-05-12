const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const quiz = require('../../files/quiz.json');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === "rock") {
                const { lostRock, tieRock, wonRock } = require('../../embeds/fun');
                const { rpsAgain } = require('../../interactions/fun');
                const rpsSchema = require('../../schemas/rpsSchema');
                const rpsDatabase = await rpsSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    messageId: interaction.message.id,
                }, (err, rps) => {
                    if (err) console.error(err)
                    if (!rps) return interaction.reply({ ephemeral: true, content: "This isn't your button!" }).catch(( err => { } ))
                }).clone().catch(function (err) { console.log(err) });
                if (!rpsDatabase) return;
                if (rpsDatabase.result === "rock") interaction.reply({ embeds: [tieRock], components: [rpsAgain] }).catch(( err => { } ))
                else if (rpsDatabase.result === "paper") interaction.reply({ embeds: [lostRock], components: [rpsAgain], components: [rpsAgain] }).catch(( err => { } ))
                else if (rpsDatabase.result === "scissors") interaction.reply({ embeds: [wonRock], components: [rpsAgain] }).catch(( err => { } ))
                await rpsDatabase.delete();
            }

            if (interaction.customId === "paper") {
                const { lostPaper, wonPaper, tiePaper } = require('../../embeds/fun');
                const { rpsAgain } = require('../../interactions/fun');
                const rpsSchema = require('../../schemas/rpsSchema');
                const rpsDatabase = await rpsSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    messageId: interaction.message.id,
                }, (err, rps) => {
                    if (err) console.error(err)
                    if (!rps) return interaction.reply({ ephemeral: true, content: "This isn't your button!" }).catch(( err => { } ))
                }).clone().catch(function (err) { console.log(err) });
                if (!rpsDatabase) return;
                if (rpsDatabase.result === "rock") interaction.reply({ embeds: [wonPaper], components: [rpsAgain] }).catch(( err => { } ))
                else if (rpsDatabase.result === "paper") interaction.reply({ embeds: [tiePaper], components: [rpsAgain] }).catch(( err => { } ))
                else if (rpsDatabase.result === "scissors") interaction.reply({ embeds: [lostPaper], components: [rpsAgain] }).catch(( err => { } ))
                await rpsDatabase.delete();
            }

            if (interaction.customId === "scissors") {
                const { lostScissors, wonScissors, tieScissors } = require('../../embeds/fun');
                const { rpsAgain } = require('../../interactions/fun');
                const rpsSchema = require('../../schemas/rpsSchema');
                const rpsDatabase = await rpsSchema.findOne({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    messageId: interaction.message.id,
                }, (err, rps) => {
                    if (err) console.error(err)
                    if (!rps) return interaction.reply({ ephemeral: true, content: "This isn't your button!" }).catch(( err => { } ))
                }).clone().catch(function (err) { console.log(err) });
                if (!rpsDatabase) return;
                if (rpsDatabase.result === "rock") interaction.reply({ embeds: [lostScissors], components: [rpsAgain] }).catch(( err => { } ))
                else if (rpsDatabase.result === "paper") interaction.reply({ embeds: [wonScissors], components: [rpsAgain] }).catch(( err => { } ))
                else if (rpsDatabase.result === "scissors") interaction.reply({ embeds: [tieScissors], components: [rpsAgain] }).catch(( err => { } ))
                await rpsDatabase.delete();
            }

            if (interaction.customId === "rpsagain") {
                try {
                    const { rpsButton } = require('../../interactions/fun');
                    const { rps } = require('../../embeds/fun');

                    const message = await interaction.reply({ embeds: [rps], components: [rpsButton], fetchReply: true }).catch(( err => { } ))
                    const options = ['rock', 'paper', 'scissors'];
                    const random = options[Math.floor(Math.random() * options.length)];
                    const rpsSchema = require('../../schemas/rpsSchema');
                    const newRps = new rpsSchema({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        result: random,
                        messageId: message.id,
                    });
                    newRps.save().catch(( err => { } ))
                } catch (e) {
                    interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
                    client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: dog`)] }).catch(( err => { } ));
                    return;
                }
            }

            if (interaction.customId === "answer1") {
                const embedRaw = interaction.message.embeds;
                const embed = embedRaw[Math.floor(Math.random() * embedRaw.length)];
                const description = embed.description;

                function getQuizAnswers(desc) {
                    return quiz.filter(
                        function (quiz) {
                            return quiz.question == desc
                        }
                    );
                }
                const answersRaw = getQuizAnswers(description);
                const answers = answersRaw[Math.floor(Math.random() * answersRaw.length)];

                if (answers.answer1 === answers.correct) {
                    const correctEmbed = new MessageEmbed()
                        .setTitle(`You were correct!`)
                        .setDescription(`**Question:**\n${answers.question}`)
                        .addField(`Answer`, `${answers.correct}`)
                        .setColor("GREEN")
                        
                    interaction.update({ embeds: [correctEmbed], components: [] }).catch(( err => { } ))
                } else {
                    const wrongEmbed = new MessageEmbed()
                        .setTitle(`You were wrong!`)
                        .setDescription(`**Question:**\n${answers.question}`)
                        .addField(`Correct Answer`, `${answers.correct}`)
                        .addField(`Your answer`, `${answers.answer1}`)
                        .setColor("RED")
                        
                    interaction.update({ embeds: [wrongEmbed], components: [] }).catch(( err => { } ))
                }
            }

            if (interaction.customId === "answer2") {
                const embedRaw = interaction.message.embeds;
                const embed = embedRaw[Math.floor(Math.random() * embedRaw.length)];
                const description = embed.description;

                function getQuizAnswers(desc) {
                    return quiz.filter(
                        function (quiz) {
                            return quiz.question == desc
                        }
                    );
                }
                const answersRaw = getQuizAnswers(description);
                const answers = answersRaw[Math.floor(Math.random() * answersRaw.length)];

                if (answers.answer2 === answers.correct) {
                    const correctEmbed = new MessageEmbed()
                        .setTitle(`You were correct!`)
                        .setDescription(`**Question:**\n${answers.question}`)
                        .addField(`Answer`, `${answers.correct}`)
                        .setColor("GREEN")
                        
                    interaction.update({ embeds: [correctEmbed], components: [] }).catch(( err => { } ))
                } else {
                    const wrongEmbed = new MessageEmbed()
                        .setTitle(`You were wrong!`)
                        .setDescription(`**Question:**\n${answers.question}`)
                        .addField(`Correct Answer`, `${answers.correct}`)
                        .addField(`Your answer`, `${answers.answer2}`)
                        .setColor("RED")
                        
                    interaction.update({ embeds: [wrongEmbed], components: [] }).catch(( err => { } ))
                }
            }

            if (interaction.customId === "answer3") {
                const embedRaw = interaction.message.embeds;
                const embed = embedRaw[Math.floor(Math.random() * embedRaw.length)];
                const description = embed.description;

                function getQuizAnswers(desc) {
                    return quiz.filter(
                        function (quiz) {
                            return quiz.question == desc
                        }
                    );
                }
                const answersRaw = getQuizAnswers(description);
                const answers = answersRaw[Math.floor(Math.random() * answersRaw.length)];

                if (answers.answer3 === answers.correct) {
                    const correctEmbed = new MessageEmbed()
                        .setTitle(`You were correct!`)
                        .setDescription(`**Question:**\n${answers.question}`)
                        .addField(`Answer`, `${answers.correct}`)
                        .setColor("GREEN")
                        
                    interaction.update({ embeds: [correctEmbed], components: [] }).catch(( err => { } ))
                } else {
                    const wrongEmbed = new MessageEmbed()
                        .setTitle(`You were wrong!`)
                        .setDescription(`**Question:**\n${answers.question}`)
                        .addField(`Correct Answer`, `${answers.correct}`)
                        .addField(`Your answer`, `${answers.answer3}`)
                        .setColor("RED")
                        
                    interaction.update({ embeds: [wrongEmbed], components: [] }).catch(( err => { } ))
                }
            }
        }
    }
}