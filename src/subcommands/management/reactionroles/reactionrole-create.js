const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { getIdConfig } = require('@configs/idConfig');
const { getReactionConfig } = require('@configs/reactionConfig');
const { channelBlacklist, permissionBitToString } = require('@constants/discord');
const { Embed } = require('@constants/embed');
const Reaction = require('@schemas/ReactionRole');

module.exports = {
  parent: 'reactionroles',
  name: 'create',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getReactionConfig(client, interaction.guildId);
    const ids = await getIdConfig(interaction.guildId);
    if (!config || !ids)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use. Please run the command again.",
          ),
        ],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Reaction roles are not enabled in this server.')],
      });

    const channel = interaction.options.getChannel('channel');
    const messageId = interaction.options.getString('message-id');
    const role = interaction.options.getRole('role');
    const emoji = interaction.options.getString('emoji');
    const mode = interaction.options.getString('mode');
    const requiredPermission = interaction.options.getString('required-permission') ?? 'None';

    if (!channel || !messageId || !role || !emoji || !mode || !requiredPermission)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
      });

    if (channelBlacklist.includes(channel.type))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid channel type.')],
      });

    if (role.rawPosition > interaction.guild.members.me.roles.highest.rawPosition)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('I cannot give that role to users! Make sure the role is below my roles.'),
        ],
      });

    if (await Reaction.findOne({ guildId: interaction.guildId, emoji: emoji, messageId }))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('That emoji is already used for a reactionrole on that message.')],
      });

    channel.messages
      .fetch({ message: messageId })
      .then(async message => {
        if (!message)
          return await interaction.editReply({
            embeds: [new Embed(color).setDescription(`Couldn't find any messages with that id in ${channel}.`)],
          });

        await message
          .react(`${emoji}`)
          .then(async () => {
            await interaction.editReply({
              embeds: [
                new Embed(color).setDescription('Successfully created a new reaction role.').addFields(
                  { name: 'Emoji', value: `${emoji}`, inline: true },
                  { name: 'Channel', value: `${channel}`, inline: true },
                  { name: 'Role', value: `${role}`, inline: true },
                  { name: 'Mode', value: `${mode}`, inline: true },
                  {
                    name: 'Required Permission',
                    value: `${
                      requiredPermission === 'None' ? 'none' : await permissionBitToString(requiredPermission)
                    }`,
                    inline: true,
                  },
                ),
              ],
            });

            const newReaction = new Reaction({
              guildId: interaction.guildId,
              channelId: channel.id,
              reqPermission: requiredPermission,
              excludedRoles: [],
              messageId,
              emoji,
              reqRoles: [],
              roleId: role.id,
              type: mode,
            });

            await newReaction.save();
          })
          .catch(async e => {
            return await interaction.editReply({
              embeds: [new Embed(color).setDescription('That is not a valid emoji.')],
            });
          });
      })
      .catch(async e => {
        return await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Couldn't find any messages with that id in ${channel}.`)],
        });
      });
  },
};
