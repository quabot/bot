import { getAutomodConfig } from '@configs/automodConfig';
import { Embed } from '@constants/embed';
import { attachmentsCooldown } from '@functions/automod/attachmentsCooldown';
import { chatCooldown } from '@functions/automod/chatCooldown';
import { customRegex } from '@functions/automod/customRegex';
import { excessiveCaps } from '@functions/automod/excessiveCaps';
import { excessiveEmojis } from '@functions/automod/excessiveEmojis';
import { excessiveMentions } from '@functions/automod/excessiveMentions';
import { excessiveSpoilers } from '@functions/automod/excessiveSpoilers';
import { externalLinks } from '@functions/automod/externalLinks';
import { newLines } from '@functions/automod/newLines';
import { profanityFilter } from '@functions/automod/profanityFilter';
import { regexPreCheck } from '@functions/automod/regexPreCheck';
import { repeatedText } from '@functions/automod/repeatedText';
import { serverInvites } from '@functions/automod/serverInvites';
import { hasAnyPerms } from '@functions/discord';
import { EventArgs } from '@typings/functionArgs';
import { Events, Message, PermissionFlagsBits, TextChannel } from 'discord.js';

export default {
  event: Events.MessageUpdate,
  name: 'automodHandleEditedMessage',
  async execute({ client, color }: EventArgs, _:any, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;
    if (!message.guild) return;

    const config = await getAutomodConfig(message.guildId, client);
    if (!config) return;

    if (!config.enabled) return;

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

    const errors:string[] = [];
    if (await chatCooldown(message, config, client, color)) return;
    if (await profanityFilter(message, config, client, color, member)) return;
    if (await attachmentsCooldown(message, config, client, color)) return;
    if (await repeatedText(message, config, client, color)) return;
    
    //* Run the regex. If there is any error in this regex, delete the message.
    if (!(await regexPreCheck(message, config))) {
      //* Delete the message
      if (message.deletable) await message.delete().catch(() => null);
    }

    //* Send the logs, run the actions etc.
    const caps: any = await excessiveCaps(message, config, client, color, member);
    if (caps) errors.push(caps);
    const emojis: any = await excessiveEmojis(message, config, client, color, member);
    if (emojis) errors.push(emojis);
    const mentions: any = await excessiveMentions(message, config, client, color, member);
    if (mentions) errors.push(mentions);
    const spoilers: any = await excessiveSpoilers(message, config, client, color, member);
    if (spoilers) errors.push(spoilers);
    const eLink: any = await externalLinks(message, config, client, color, member);
    if (eLink) errors.push(eLink);
    const nLine: any = await newLines(message, config, client, color, member);
    if (nLine) errors.push(nLine);
    const invite: any = await serverInvites(message, config, client, color, member);
    if (invite) errors.push(invite);

    for (const regex of config.customRegex) {
      const result = await customRegex(message, config, client, color, member, regex);
      if (result) errors.push(result);
    }

    //* Send the alert message
    if (errors.length === 0) return;

    let description = `Hey ${message.author}, `;
    if (errors.length === 1) description += errors[0].toLocaleLowerCase();
    else description += 'you have the following issues:\n' + errors.join('\n');

    //* Delete the message
    if (message.deletable) await message.delete().catch(() => null);

    //* Send the alert message (if enabled)
    if (config.alert) {
      const alertMessage = await (message.channel as TextChannel).send({
        embeds: [
          new Embed(color)
            .setDescription(description)
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
