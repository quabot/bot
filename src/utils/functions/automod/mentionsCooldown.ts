import { ColorResolvable, type Message } from 'discord.js';
import { IAutomodConfig } from '@typings/schemas';
import { Embed } from '@constants/embed';
import { Client } from '@classes/discord';

export let cooldowns: { guildId: string; userId: string; recentMessages: number[] }[] = [];

export const attachmentsCooldown = async (message: Message, config: IAutomodConfig, _: Client, color: ColorResolvable) => {
  if (!config.mentionsCooldown.enabled) return;

  const mentionsRegex = /<@&[0-9]+>|<@![0-9]+>|<@[0-9]+>|<#[0-9]+>/g;
  const mentions = message.content.match(mentionsRegex)?.length ?? 0;
  if (mentions === 0) return;
  
  //* Handle the chat cooldown
  const now = new Date().getTime();
  const maxMessageAge = now - config.mentionsCooldown.duration * 1000;
  const cooldown = cooldowns.find(c => c.guildId === message.guildId && c.userId === message.author.id);
  if (!cooldown) {
    cooldowns.push({
      guildId: message.guildId ?? '',
      userId: message.author.id,
      recentMessages: [new Date().getTime()],
    });
    return;
  }
  cooldowns[cooldowns.indexOf(cooldown)].recentMessages = cooldowns[cooldowns.indexOf(cooldown)].recentMessages.filter(
    time => time > maxMessageAge,
  );
  
  if (cooldowns[cooldowns.indexOf(cooldown)].recentMessages.length >= config.mentionsCooldown.messageLimit) {
    //* Delete the message
    if (message.deletable) await message.delete().catch(() => null);

    //* Send the alert message (if enabled)
    if (config.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(
              `Hey ${message.author}, you can only send ${config.mentionsCooldown.messageLimit} messages with mentions (channels, users or roles) in the last ${config.mentionsCooldown.duration} seconds before sending a message with mentions again!`,
            )
            .setFooter({ text: `This message will be deleted in ${config.deleteAlertAfter} seconds.` }),
        ],
        content: `<@${message.author.id}>`,
      });
      setTimeout(() => {
        if (alertMessage.deletable) alertMessage.delete();
      }, config.deleteAlertAfter * 1000);
    }

    return true;
  } else {
    cooldowns[cooldowns.indexOf(cooldown)].recentMessages.push(new Date().getTime());
  }
};
