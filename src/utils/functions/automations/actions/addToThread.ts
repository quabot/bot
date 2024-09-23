import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { ThreadChannel, UserResolvable } from 'discord.js';
import { IAutomationAction } from '@typings/schemas';

export const addToThreadAutomation = async (channel: ThreadChannel, client: Client, action: IAutomationAction) => {
  if (!channel) return;
  if (!channel.guild) return;

  const config = await getAutomationConfig(channel.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  if (!action.users) return;
  if (action.users.length === 0) return;

  const users:UserResolvable[] = action.users.map(user => channel.guild.members.cache.get(user) as UserResolvable);
  if (users.length === 0) return;
  users.forEach(async user => {
    channel.members.add(user);
  });
};
