import { type Message } from 'discord.js';
import { IAutomodConfig } from '@typings/schemas';

export const cooldowns = new Map<string, number>();
export const quickCheckCooldown = (userId: string, guildId: string): boolean => {
  const now = new Date().getTime();
  const cooldown = cooldowns.get(`${userId}-${guildId}`) ?? 0;
  if (cooldown > now) return false;
  return true;
};

export const chatCooldown = async (message: Message, config: IAutomodConfig) => {
  //* Handle the chat cooldown
  const now = new Date().getTime();
  const cooldown = cooldowns.get(`${message.author.id}-${message.guildId}`) ?? 0;
  if (cooldown < now) cooldowns.set(`${message.author.id}-${message.guildId}`, now + config.chatCooldown.cooldown * 1000);
  else return `you must wait ${config.chatCooldown.cooldown} seconds before sending a message again!`;
};
