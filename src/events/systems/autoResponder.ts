import type { Message } from 'discord.js';
import { CustomEmbed } from '@constants/customEmbed';
import { getServerConfig } from '@configs/serverConfig';
import { getResponderConfig } from '@configs/responderConfig';
import type { EventArgs } from '@typings/functionArgs';
import { hasAnyRole } from '@functions/discord';

export default {
  event: 'messageCreate',
  name: 'autoReponder',

  async execute({ client }: EventArgs, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;

    const respondConfig = await getResponderConfig(client, message.guildId);
    if (!respondConfig) return;
    if (!respondConfig.enabled) return;

    const configColor = await getServerConfig(client, message.guildId);
    const color = configColor?.color ?? '#416683';

    const commands_list = client.custom_commands.filter(c => c.guildId === message.guildId);
    commands_list.forEach(async cL => {
      let run = false;
      if (!cL.wildcard && cL.trigger === message.content) run = true;
      if (cL.wildcard && message.content.toLowerCase().includes(cL.trigger)) run = true;

      if (cL.ignored_channels.includes(message.channel.id)) run = false;
      if (hasAnyRole(message.member, cL.ignored_roles)) run = false;
      if (run) runTrigger(cL);
    });

    //TODO CHANGE WHEN DEBUGGED
    async function runTrigger(document: any) {
      const parse = (s: string) => {
        return `${s}`
          .replaceAll('{color}', `${color}`)
          .replaceAll('{guild}', `${message.guild?.name}`)
          .replaceAll('{server}', `${message.guild?.name}`)
          .replaceAll('{members}', `${message.guild?.memberCount}`)
          .replaceAll('{user}', message.author?.toString())
          .replaceAll('{username}', message.author.username)
          .replaceAll('{tag}', message.author.tag);
      };

      if (document.type === 'message') {
        await message.reply({
          content: parse(document.message) ?? '** **',
          allowedMentions: { repliedUser: false },
        });
      } else if (document.type === 'reaction') {
        await message.react(document.reaction);
      } else if (document.type === 'embed') {
        const embed = new CustomEmbed(document.embed, parse);
        await message.reply({
          embeds: [embed],
          content: parse(document.embed.content),
        });
      }
    }
  },
};
