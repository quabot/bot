module.exports = {
    name: "purge",
    permission: "MANAGE_MESSAGES",
    description: "Purge some messages.",
    options: [
        {
            name: "amount",
            description: "How many messages should QuaBot purge?",
            required: true,
            type: "INTEGER"
        },
        {
            name: "private",
            description: "Should QuaBot hide this command being performed?",
            required: false,
            type: "BOOLEAN"
        }
    ],
    async execute(client, interaction, color) {

        try {
            let amount = interaction.options.getInteger('amount');
            let public = !interaction.options.getBoolean('private');

            
            if (interaction.channel.type === "GUILD_CATEGORY") return;
            if (interaction.channel.type === "GUILD_DIRECTORY") return;
            if (interaction.channel.type === "GUILD_FORUM") return;
            if (interaction.channel.type === "GUILD_VOICE") return;
            if (interaction.channel.type === "GUILD_STAGE_VOICE") return;

            if (amount > 0) {
                if (amount > 100) return interaction.reply({ content: `You can't delete more than 100 messages, idiot.`, ephemeral: true });
                const size = await interaction.channel.bulkDelete(amount, true).catch(err => {
                    if (err.code === 50013) {
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Lack of permissions!')
                                    .setDescription(`I need some more permissions to perform that command. I need the \`MANAGE MESSAGES\` or \`ADMINISTRATOR\` permissions for that.`)
                                    .setColor(color)
                            ]
                        }).catch(( err => { } ));
                    }
                })
                if (public) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Messages purged')
                                .setDescription(`${amount} message(s) were purged from this channel by ${interaction.user}`)
                                .setColor(color)
                        ]
                    }).catch(( err => { } ));
                } else {
                    return interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true }).catch(( err => { } ));
                }
            } else {
                return interaction.reply({ content: `You can't delete less than 1 message, idiot.`, ephemeral: true}).catch(( err => { } ));
            }
        }
        catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
        
    }
}