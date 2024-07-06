import type { GuildTextBasedChannel } from 'discord.js';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import type { IGiveaway } from '@typings/schemas';

import Giveaway from '@schemas/Giveaway';
import { shuffleArray } from './array';
import { getGiveawayConfig } from '@configs/giveawayConfig';
import { Embed } from '@constants/embed';
import { getServerConfig } from '@configs/serverConfig';
import type { Client } from '@classes/discord';

export async function rollGiveaway(
  client: Client,
  document: NonNullMongooseReturn<IGiveaway>,
  end: true,
  forceEarly?: boolean,
): Promise<boolean | void>;
export async function rollGiveaway(
  client: Client,
  document: NonNullMongooseReturn<IGiveaway>,
  end?: false,
  forceEarly?: false,
): Promise<boolean | void>;
export async function rollGiveaway(
  client: Client,
  document: NonNullMongooseReturn<IGiveaway>,
  end: boolean = false,
  forceEarly: boolean = false,
) {
  const config = await getGiveawayConfig(document.guildId, client);
  if (!config?.enabled) return;

  const giveaway = await Giveaway.findOne({
    guildId: document.guildId,
    id: document.id,
  })
    .clone()
    .catch();

  const guild = client.guilds.cache.get(document.guildId);
  if (!giveaway || !guild) return;
  if ((giveaway.ended && end) || (!giveaway.ended && !end)) return false;

  const channel = guild.channels.cache.get(giveaway.channel) as GuildTextBasedChannel | undefined;
  if (!channel) return;

  const colorConfig = await getServerConfig(client, document.guildId);
  if (!colorConfig) return;

  channel.messages
    .fetch(`${giveaway.message}`)
    .then(async message => {
      if (!message) return;

      const reactions = await message.reactions.cache.get('🎉')?.users.fetch();
      if (!reactions) return;
      const shuffled = shuffleArray(
        Array.from(
          reactions.filter(u => u.id !== client.user!.id),
          ([name, value]) => ({ name, value }),
        ),
      );

      const winners = shuffled.slice(0, giveaway.winners);
      const isWinner = winners.length !== 0;
      let winMsg = winners.map(u => `<@${u.value.id}>`).join(', ');
      if (!isWinner) winMsg = 'Not enough entries!';

      if (giveaway.winnerRole) {
        const role = guild.roles.cache.get(giveaway.winnerRole);
        if (!role) return;
        winners.forEach(async u => {
          await guild.members.fetch(u.value.id).then(async member => {
            await member.roles.add(role);
          });
        });
      }

      await message.edit({
        embeds: [
          new Embed(colorConfig.color ?? '#ffffff')
            .setTitle(`${giveaway.prize}`)
            .setDescription(
              `Ended: <t:${
                forceEarly
                  ? Math.floor(new Date().getTime() / 1000)
                  : Math.floor(parseInt(giveaway.endTimestamp) / 1000)
              }:R>
                            Winners: **${winMsg}**
                            Hosted by: <@${giveaway.host}>`,
            )
            .setFooter({ text: `ID: ${giveaway.id}` }),
        ],
      });

      if (isWinner)
        await message.reply({
          embeds: [
            new Embed(colorConfig.color ?? '#ffffff').setDescription(`${winMsg}, you won **${giveaway.prize}**!`),
          ],
          content: `${winMsg}`,
        });

      if (!isWinner)
        await message.reply({
          embeds: [
            new Embed(colorConfig.color ?? '#ffffff').setDescription(
              'There were not enough entries for a winner to be determined.',
            ),
          ],
        });

      if (end) giveaway.ended = true;
      await giveaway.save();
    })
    .catch(() => {});

  return true;
}
