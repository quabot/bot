import { getAutomodConfig } from '@configs/automodConfig';
import { Embed } from '@constants/embed';
import { chatCooldown } from '@functions/automod/chatCooldown';
import { hasAnyPerms } from '@functions/discord';
import { EventArgs } from '@typings/functionArgs';
import { Events, Message, PermissionFlagsBits } from 'discord.js';

export default {
  event: Events.MessageCreate,
  name: 'automodHandleMessage',
  async execute({ client, color }: EventArgs, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;
    if (!message.guild) return;

    const config = await getAutomodConfig(message.guildId, client);
    if (!config) return;

    if (!config.enabled || !config.chatCooldown.enabled) return;

    //* Check if the user has the bypass permission
    const member =
      message.guild?.members.cache.get(message.author.id) ??
      (await message.guild?.members.fetch(message.author.id).catch(() => null));
    if (!member) return;

    //* Member has Admin or Manage Server permissions
    if (
      hasAnyPerms(member, [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.ManageMessages,
      ])
    )
      return;

    //* Check the ignored channels & roles
    if (
      config.ignoredChannels.includes(message.channelId) ||
      member.roles.cache.some(role => config.ignoredRoles.includes(role.id))
    )
      return;

    const errors = [];
    const cooldown = await chatCooldown(message, config);
    if (cooldown) errors.push(cooldown);

		
    //* Send the alert message (if enabled)
    if (config.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(
              `Hey ${message.author}, `,
            )
            .setFooter({ text: `This message will be deleted in ${config.deleteAlertAfter} seconds.` }),
        ],
        content: `<@${message.author.id}>`,
      });
      setTimeout(() => {
        if (alertMessage.deletable) alertMessage.delete();
      }, config.deleteAlertAfter * 1000);
    }
  },
};
