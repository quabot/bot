
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');

module.exports = {
    name: "create",
    command: "reactionroles",
    async execute(client, interaction, color) {

        const channel = interaction.options.getChannel("channel");
        const message_id = interaction.options.getString("message");
        const role = interaction.options.getRole("role");
        const emoji = interaction.options.getString("emoji");
        const permission = interaction.options.getString("permission") ? interaction.options.getString("permission") : "None";
        const mode = interaction.options.getString("mode") ? interaction.options.getString("mode") : "normal";



        if (channel.type !== "GUILD_TEXT") return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("Please give a valid text channel.")
            ], ephemeral: true
        }).catch((err => { }));

        if (role.rawPosition > interaction.guild.me.roles.highest.rawPosition) return interaction.reply({
            ephemeral: true, embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription("I cannot give that role to users.")
            ], ephemeral: true
        }).catch((err => { }));

        await interaction.deferReply({ ephemeral: true });

        const Reaction = require('../../../structures/schemas/ReactionRoleSchema');
        const found = await Reaction.findOne({
            guildId: interaction.guild.id,
            messageId: message_id,
            emoji: emoji
        });

        if (found) return interaction.followUp({
            ephemeral: true, embeds: [
                new MessageEmbed()
                    .setDescription(`That reactionrole already exists!`)
                    .setColor(color)
            ]
        }).catch((err => { }));

        let error = false;

        channel.messages.fetch(message_id)
            .then(async message => {
                await message.react(`${emoji}`).catch(err => {
                    error = true
                    return interaction.followUp({
                        ephemeral: true, embeds: [
                            new MessageEmbed()
                                .setDescription(`Could not find that emoji! You can only use default emojis at this time.`)
                                .setColor(color)
                        ]
                    }).catch((err => { }));
                });

                if (!error) {
                    interaction.followUp({
                        ephemeral: true, embeds: [
                            new MessageEmbed()
                                .setDescription("Succesfully created a new reaction role.")
                                .addField("Emoji", `${emoji}`, true)
                                .addField("Channel", `${channel}`, true)
                                .addField("Role", `${role}`, true)
                                .addField("Mode", `${mode}`, true)
                                .addField("Required Permission", `${permission}`, true)
                                .setColor(color)
                        ]
                    }).catch((err => { }));

                    const newReaction = new Reaction({
                        guildId: interaction.guild.id,
                        channelId: channel.id,
                        reqPermission: permission,
                        roleId: role.id,
                        messageId: message_id,
                        emoji: emoji,
                        type: mode,
                    });
                    newReaction.save()
                        .catch(err => {
                            console.log(err);
                            interaction.followUp({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            })
            .catch(async err => {
                await interaction.followUp({
                    ephemeral: true, embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription("Could not find that message.")
                    ]
                }).catch((err => { }))
                return;
            });

        // on msg delete & role delete: delete the reaction role (save space)
    }
}
