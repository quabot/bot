const { MessageEmbed } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    name: "suggest",
    description: "Leave a suggestion.",
    async execute(client, interaction, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        levelEnabled: false,
                        pollEnabled: true,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        roleEnabled: false,
                        mainRole: "Member",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Added this server to the database! Please run that command again.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch(err => console.log(err));

            if (guildDatabase.suggestEnabled === false) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`Suggestions are disabled in this server! Ask an admin to enable them with \`/config general\``)
                        .setColor(color)
                ], ephemeral: true
            }).catch(err => console.log(err));

            const channel = interaction.guild.channels.cache.get(guildDatabase.suggestChannelID);
            if (!channel) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription("No suggestions channel setup!")
                        .setColor(color)
                ], ephemeral: true
            }).catch(err => console.log(err));

            const leaveSuggest = new Modal()
                .setCustomId('suggestion')
                .setTitle('Leave a suggestion')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('suggestion-box')
                        .setLabel('Your suggestion')
                        .setStyle('LONG')
                        .setMinLength(1)
                        .setMaxLength(300)
                        .setPlaceholder('More voice channels!')
                        .setRequired(true)
                );

            showModal(leaveSuggest, {
                client: client,
                interaction: interaction
            });
            
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}