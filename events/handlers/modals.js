const { EmbedBuilder, InteractionType, Interaction, Colors } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction, client) {

        if (!interaction.type === InteractionType.ModalSubmit) return;
        const modal = client.modals.get(interaction.customId);

        if (!modal) return;
        if (modal.permission && !interaction.member.permissions.has(modal.permission))
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`⛔ You do not have permission to use that modal.\nYou need the permission: \`${modal.permission}\` to do that`)
                ], ephemeral: true
            }).catch(err => console.warn(err));

        // * Checks the bot's permissions.
        if (modal.permissions) {
            let error = false;
            modal.permissions.forEach(permission => {
                if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
            });

            if (error) {
                interaction.reply({
                    content:
                        `I need the permission(s): \`${modal.permissions.map(i => i)}\` to execute that command. Double check my permissions for the server and/or this channel.`
                    , ephemeral: true
                }).catch((err => { }));
                return;
            }

        }

        if (modal.ownerOnly && modal.member.id !== modal.guild.ownerId)
            return modal.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("RED")
                        .setDescription("⛔ Only the owner can use that modal.")
                ], ephemeral: true
            }).catch(err => console.warn(err));
        const Customization = require('../../structures/schemas/CustomizationSchema');
        const CustomizationDatabase = await Customization.findOne({
            guildId: interaction.guild.id,
        }, (err, customization) => {
            if (err) console.log(err);
            if (!customization) {
                const newCustomization = new Customization({
                    guildId: interaction.guild.id,
                    color: "#3a5a74"
                });
                newCustomization.save();
            }
        }).clone().catch((err => { }));

        if (!CustomizationDatabase) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription("Unable to get this server's customization settings. Please try again.")
            ], ephemeral: true
        }).catch((err => { }));

        modal.execute(interaction, client, CustomizationDatabase.color).catch(err => {

            const channel = client.channels.cache.get("1000781833052639242");
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle("There was an error!")
                        .setDescription(`\`${err}\`
                        
                        **Modal:** ${interaction.customId}
                        **Guild:** ${interaction.guild.name}
                        **User:** ${interaction.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: "InteractionType Modal" })
                ]
            });

        });
    }
}
