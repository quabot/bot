import { ColorResolvable, type Message } from 'discord.js';
import { IAutomodConfig } from '@typings/schemas';
import { Embed } from '@constants/embed';
import { Client } from '@classes/discord';

export const cooldowns = new Map<string, number>();

export const chatCooldown = async (message: Message, config: IAutomodConfig, _: Client, color: ColorResolvable) => {
  if (!config.chatCooldown.enabled) return;

  //* Handle the chat cooldown
  const now = new Date().getTime();
  const cooldown = cooldowns.get(`${message.author.id}-${message.guildId}`) ?? 0;
  if (cooldown < now)
    cooldowns.set(`${message.author.id}-${message.guildId}`, now + config.chatCooldown.cooldown * 1000);
  else {
    //* Delete the message
    if (message.deletable) await message.delete().catch(() => null);

    //* Send the alert message (if enabled)
    if (config.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(
              `Hey ${message.author}, you must wait ${config.chatCooldown.cooldown} seconds before sending a message again!`,
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
  }
};
