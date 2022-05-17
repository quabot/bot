const { MessageEmbed } = require("discord.js");
const ms = require('ms');

module.exports = {
    id: "poll",
    permission: "ADMINISTRATOR",
    async execute(interaction, client, color) {
        const question = interaction.fields.getTextInputValue('poll-question');
        let description;

        await interaction.deferReply({ ephemeral: true });

        const Poll = require('../../structures/schemas/PollSchema');
        const pollDatabase = await Poll.findOne({
            guildId: interaction.guild.id,
            interactionId: interaction.message.id,
        }, (err, poll) => {
            if (err) console.error(err);
            if (!poll) return;
        }).clone().catch(function (err) { console.log(err) });

        if (!pollDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`That poll does not exist.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ));

        interaction.components.map(item => {
            if (item.components[0].customId === "poll-question") return;

            const cId = `${item.components[0].customId}`;
            const id = cId.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣");
            const value = item.components[0].value;

            if (description) description = `${description}\n${id} - ${value}`;
            if (!description) description = `${id} - ${value}`;
        });

        const embed = new MessageEmbed()
            .setTitle(`${question}`)
            .setDescription(`${description}`)
            .addFields(
                { name: "Hosted by", value: `${interaction.user}`, inline: true },
                { name: "Ends in", value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDatabase.duration) / 1000)}:R>`, inline: true }
            )
            .setFooter(`ID: ${pollDatabase.pollId}`)
            .setTimestamp()
            .setColor(color);

        const channel = interaction.guild.channels.cache.get(pollDatabase.channelId);
        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Could not find the channel.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ))
        const msg = await channel.send({ embeds: [embed] }).catch(err => console.log(err))

        for (let i = 0; i < pollDatabase.options; i++) {
            let b = `${i + 1}`;

            msg.react(`${b.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣")}`)
        }

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Succesfully created a poll that ends <t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDatabase.duration) / 1000)}:R> in ${channel}!\nThe ID for this poll is ${pollDatabase.pollId}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ));

        await pollDatabase.updateOne({
            msgId: msg.id,
            endTimestamp: Math.round(new Date().getTime()) + Math.round(ms(pollDatabase.duration)),
        });
    }
}