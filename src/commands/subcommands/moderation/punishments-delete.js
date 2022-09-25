const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, PermissionFlagsBits, Colors } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "delete",
    command: "punishments",
    /**
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true }).catch(((e => { })))
        
        const id = interaction.options.getInteger("id");
        const user = interaction.options.getUser("user");
        const type = interaction.options.getString("type");
        
        const ModActionSchema = require('../../../structures/schemas/ModActionSchema');
        const found = await ModActionSchema.findOne({
            guildId: interaction.guildId,
            userId: user.id,
            punishmentId: id,
            type,
        }).catch((e => { }));

        if (!found) return interaction.editReply({
            embeds:[await generateEmbed(color, `No punishments with the id ${id}, user ${user} and type ${type} was found.`)]
        }).catch((e => { }));

        await ModActionSchema.findOneAndDelete({
            guildId: interaction.guildId,
            userId: user.id,
            punishmentId: id,
            type,
        }).catch((e => { }));

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Punishment deleted")
                    .setTimestamp()
                    .addFields(
                        { name: "ID", value: `${found.punishmentId}`, inline: true },
                        { name: "Type", value: `${found.type}`, inline: true },
                        { name: "User", value: `${user}`, inline: true },
                        { name: "Reason", value: `${found.reason}`, inline: false },
                    )
            ]
        }).catch((e => { }));
    }
}
