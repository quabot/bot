const { Client, ChannelType, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");
const { permissionBitToString } = require("../../../structures/functions/strings");
const Reaction = require('../../../structures/schemas/ReactionRoleSchema');
let error = false;

module.exports = {
    name: "create",
    command: "reactionroles",
    /**
     * @param {Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {


        // DISCLAIMER: This is old code from QuaBot v3.1, it works, but if you're going to update it, rewrite it.

        

        await interaction.deferReply({ ephemeral: true }).catch(() => null);

        const channel = interaction.options.getChannel("channel");
        const message_id = interaction.options.getString("message");
        const role = interaction.options.getRole("role");
        const emoji = interaction.options.getString("emoji");
        const permission = interaction.options.getString("permission") ? interaction.options.getString("permission") : "None";
        const mode = interaction.options.getString("mode") ? interaction.options.getString("mode") : "normal";

        const channelBlacklist = [
            ChannelType.DM,
            ChannelType.GroupDM,
            ChannelType.GuildCategory,
            ChannelType.GuildDirectory,
            ChannelType.GuildForum,
            ChannelType.GuildStageVoice,
            ChannelType.GuildVoice,
        ]
        if (channelBlacklist.includes(channel.type)) return interaction.editReply({
            embeds: [await generateEmbed(color, "Please enter a valid channel to use.")]
        }).catch(() => null);

        if (role.rawPosition > interaction.guild.members.me.roles.highest.rawPosition) return interaction.editReply({
            ephemeral: true, embeds: [await generateEmbed(color, "I cannot give that role to users. Make sure my role is above the role you're trying to setup.")],
        }).catch(() => null);

        if (await Reaction.findOne({ guildId: interaction.guild.id, messageId: message_id, emoji: emoji })) return interaction.editReply({
            ephemeral: true, embeds: [await generateEmbed(color, "That reactionrole is already setup.")],
        }).catch(() => null);


        channel.messages.fetch({ message: message_id })
            .then(async message => {
                await message.react(`${emoji}`).catch(async err => {
                    error = true
                    return interaction.editReply({
                        ephemeral: true, embeds: [await generateEmbed(color, "That is not a valid emoji. Please note that only default emojis work.")]
                    }).catch(() => null);
                });

                if (!error) {
                    interaction.editReply({
                        ephemeral: true, embeds: [
                            new EmbedBuilder()
                                .setDescription("Successfully created a new reaction role.")
                                .addFields(
                                    { name: "Emoji", value: `${emoji}`, inline: true },
                                    { name: "Channel", value: `${channel}`, inline: true },
                                    { name: "Role", value: `${role}`, inline: true },
                                    { name: "Mode", value: `${mode}`, inline: true },
                                    { name: "Required Permission", value: `${await permissionBitToString(permission)}`, inline: true },
                                )
                                .setColor(color)
                        ]
                    }).catch((e => console.log(e)));

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
                            interaction.followUp({ embeds: [new EmbedBuilder().setDescription("There was an error with the database.").setColor(color)] }).catch(() => null)
                        });
                }
            })
            .catch(async e => {
                await interaction.editReply({
                    ephemeral: true, embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription("Could not find that message.")
                    ]
                }).catch(() => null);
                return;
            });
    }
}