import { ColorResolvable, type Message } from 'discord.js';
import { IAutomodConfig } from '@typings/schemas';
import { Embed } from '@constants/embed';
import { Client } from '@classes/discord';

export let cooldowns: { guildId: string; userId: string; recentMessages: number[] }[] = [];

export const chatCooldown = async (message: Message, config: IAutomodConfig, _: Client, color: ColorResolvable) => {
  if (!config.chatCooldown.enabled) return;

  //* Handle the chat cooldown
  const now = new Date().getTime();
  const maxMessageAge = now - config.chatCooldown.duration * 1000;
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

  if (cooldowns[cooldowns.indexOf(cooldown)].recentMessages.length >= config.chatCooldown.messageLimit) {
    //* Delete the message
    if (message.deletable) await message.delete().catch(() => null);

    //* Send the alert message (if enabled)
    if (config.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(
              `Hey ${message.author}, you can only send ${config.chatCooldown.messageLimit} messages in the last ${config.chatCooldown.duration} seconds before sending a message again!`,
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
