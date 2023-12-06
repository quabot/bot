import type { Client } from '@classes/discord';
import { getModerationConfig } from '@configs/moderationConfig';
import { getServerConfig } from '@configs/serverConfig';
import { Embed } from '@constants/embed';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import type { IPunishment } from '@typings/schemas';
import Punishment from '@schemas/Punishment';
import { ChannelType } from 'discord.js';
import { hasSendPerms } from './discord';

export async function tempUnban(client: Client, document: NonNullMongooseReturn<IPunishment>) {
  const guild = client.guilds.cache.get(`${document.guildId}`);
  if (!guild) return;

  await guild.bans.fetch(document.userId).catch(() => {});

  guild.members.unban(document.userId).catch(err => {
    if (err.code !== 50035) return;
  });

  const p = await Punishment.findOne({
    guildId: document.guildId,
    userId: document.userId,
    id: document.id,
  });

  if (!p) return;

  p.active = false;
  await p.save();

  const colorConfig = await getServerConfig(client, document.guildId);

  const moderationConfig = await getModerationConfig(client, document.guildId);

  const logChannel = guild.channels.cache.get(`${moderationConfig!.channelId}`);
  if (!logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum)
    return;
  if (!hasSendPerms(logChannel)) return;

  await logChannel.send({
    embeds: [
      new Embed(colorConfig!.color ?? '#ffffff').setTitle('Member Auto-Unbanned').addFields(
        { name: 'User', value: `<@${document.userId}>`, inline: true },
        {
          name: 'Unbanned After',
          value: `${document.duration}`,
          inline: true,
        },
        { name: 'Ban-Id', value: `${document.id}`, inline: true },
      ),
    ],
  });
}
