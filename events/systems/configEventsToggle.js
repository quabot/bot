const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client, color) {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId === "events") {

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: interaction.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: interaction.guild.id,
                        enabled: [
                            'emojiCreateDelete',
                            'emojiUpdate',
                            'guildBanAdd',
                            'guildBanRemove',
                            'roleAddRemove',
                            'nickChange',
                            'boost',
                            'guildUpdate',
                            'inviteCreateDelete',
                            'messageDelete',
                            'messageUpdate',
                            'roleCreateDelete',
                            'roleUpdate',
                            'stickerCreateDelete',
                            'stickerUpdate',
                            'threadCreateDelete',
                        ],
                        disabled: [
                            'voiceMove',
                            'voiceJoinLeave',
                        ]
                    });
                    newLog.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!logDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`Added this server to the database, please run that command again.`)
                ]
            }).catch((err => { }));

            const array = [
                'emojiCreateDelete',
                'emojiUpdate',
                'guildBanAdd',
                'guildBanRemove',
                'roleAddRemove',
                'nickChange',
                'boost',
                'guildUpdate',
                'inviteCreateDelete',
                'messageDelete',
                'messageUpdate',
                'roleCreateDelete',
                'roleUpdate',
                'stickerCreateDelete',
                'stickerUpdate',
                'threadCreateDelete',
                'voiceMove',
                'voiceJoinLeave',
            ];

            let disabled = [];
            let enabled = [];

            array.forEach(async item => {
                if (interaction.values.includes(item)) {
                    enabled.push(`${item}`)
                } else {
                    disabled.push(`${item}`)
                }
            });

            await logDatabase.updateOne({
                enabled: enabled,
                disabled: disabled,
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Succesfully updated.`)
                        .setColor(color)
                ], ephemeral: true
            })

        }
    }
}