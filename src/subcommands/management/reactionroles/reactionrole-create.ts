import { getIdConfig } from '@configs/idConfig';
import { getReactionConfig } from '@configs/reactionConfig';
import { channelBlacklist, permissionBitToString } from '@constants/discord';
import { Embed } from '@constants/embed';
import Reaction from '@schemas/ReactionRole';
import type { CommandArgs } from '@typings/functionArgs';
import { GuildTextBasedChannel as GuildTextBasedChannelEnum } from '@typings/discord';
import type { GuildTextBasedChannel } from 'discord.js';
import { hasRolePerms } from '@functions/discord';
import { handleError } from '@constants/errorHandler';
import { isSnowflake } from '@functions/string';

export default {
  parent: 'reactionroles',
  name: 'create',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getReactionConfig(client, interaction.guildId!);
    const ids = await getIdConfig(interaction.guildId!);
    if (!config || !ids)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Reaction roles are not enabled in this server.')],
      });

    const channel = interaction.options.getChannel('channel', true, GuildTextBasedChannelEnum) as GuildTextBasedChannel;
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

    if (hasRolePerms(role))
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'I cannot give that role to users! Make sure the role is below my roles and that I have the `ManageRoles` permission.',
          ),
        ],
      });

    if (
      await Reaction.findOne({
        guildId: interaction.guildId,
        emoji: emoji,
        messageId,
      })
    )
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('That emoji is already used for a reactionrole on that message.')],
      });

    if (!isSnowflake(messageId)) {
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "This isn't a valid id, a message id looks something like this `1138538614419095643`.\nFor help you could look at [this article](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)",
          ),
        ],
      });
    }

    channel.messages
      .fetch({ message: messageId })
      .then(async message => {
        if (!message)
          return await interaction.editReply({
            embeds: [
              new Embed(color).setDescription(
                `Couldn't find any messages with that id in ${channel}. Do I have the \`ReadMessages\` permission?`,
              ),
            ],
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
            if (e.code === 10014)
              return await interaction.editReply({
                embeds: [new Embed(color).setDescription('That is not a valid emoji.')],
              });

            handleError(client, e, interaction, 'reactionrole/create');
          });
      })
      .catch(async () => {
        return await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Couldn't find any messages with that id in ${channel}.`)],
        });
      });
  },
};
