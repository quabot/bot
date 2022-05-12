const { MessageEmbed } = require("discord.js");
const ms = require('ms');

module.exports = {
    id: "poll",
    permission: "ADMINISTRATOR",
    async execute(modal, client, color) {
        const question = modal.getTextInputValue('poll-question');
        let description;

        await modal.deferReply({ ephemeral: true });

        const Poll = require('../../structures/schemas/PollSchema');
        const pollDatabase = await Poll.findOne({
            guildId: modal.guild.id,
            interactionId: modal.message.id,
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
        }).catch(( err => { } ))


        modal.fields.map(item => {
            if (item.customId === "poll-question") return;

            const id = item.customId.replace("1", "1️⃣").replace("2", "2️⃣").replace("3", "3️⃣").replace("4", "4️⃣");
            const value = item.value;

            if (description) description = `${description}\n${id} - ${value}`;
            if (!description) description = `${id} - ${value}`;
        });

        const embed = new MessageEmbed()
            .setTitle(`${question}`)
            .setDescription(`${description}`)
            .addFields(
                { name: "Hosted by", value: `${modal.user}`, inline: true },
                { name: "Ends in", value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDatabase.duration) / 1000)}:R>`, inline: true }
            )
            .setFooter(`ID: ${pollDatabase.pollId}`)
            .setTimestamp()
            .setColor(color);

        const channel = modal.guild.channels.cache.get(pollDatabase.channelId);
        if (!channel) return modal.followUp({
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

        modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Succesfully created a poll that ends <t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(pollDatabase.duration) / 1000)}:R> in ${channel}!\nThe ID for this poll is ${pollDatabase.pollId}`)
                    .setColor(color)
            ], ephemeral: true
        }).catch(( err => { } ))

        await pollDatabase.updateOne({
            msgId: msg.id,
            endTimestamp: Math.round(new Date().getTime()) + Math.round(ms(pollDatabase.duration)),
        })
    }
}