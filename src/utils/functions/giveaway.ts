import type { Client } from 'discord.js';
import type { MongooseReturn } from '@typings/mongoose';

import Giveaway from '@schemas/Giveaway';
import { shuffleArray } from './array';
import { getGiveawayConfig } from '@configs/giveawayConfig';
import { Embed } from '@constants/embed';
import { getServerConfig } from '@configs/serverConfig';

async function endGiveaway(client: Client, document: MongooseReturn<>, forceEarly: boolean) {
  const config = await getGiveawayConfig(client, document.guildId);
  if (!config.enabled) return;

  const giveaway = await Giveaway.findOne({
    guildId: document.guildId,
    id: document.id,
  })
    .clone()
    .catch();

  const guild = await client.guilds.cache.get(document.guildId);
  if (!giveaway || !guild) return;

  const channel = await guild.channels.cache.get(giveaway.channel);
  if (!channel) return;

  const colorConfig = await getServerConfig(client, document.guildId);

  channel.messages
    .fetch(`${giveaway.message}`)
    .then(async message => {
      if (!message) return;

      const reactions = await message.reactions.cache.get('🎉').users.fetch();
      const shuffled = await shuffleArray(
        // eslint-disable-next-line no-undef
        (array = Array.from(
          reactions.filter(u => u.id !== client.user.id),
          ([name, value]) => ({ name, value }),
        )),
      );

      const winners = shuffled.slice(0, giveaway.winners);
      const isWinner = winners.length !== 0;
      let winMsg = winners.map(u => `<@${u.value.id}>`).join(', ');
      if (!isWinner) winMsg = 'Not enough entries!';

      await message.edit({
        embeds: [
          new Embed(colorConfig.color ?? '#fff')
            .setTitle(`${giveaway.prize}`)
            .setDescription(
              `Ended: <t:${
                forceEarly ? Math.floor(new Date().getTime() / 1000) : Math.floor(giveaway.endTimestamp / 1000)
              }:R>
                            Winners: **${winMsg}**
                            Hosted by: <@${giveaway.host}>`,
            )
            .setFooter({ text: `ID: ${giveaway.id}` }),
        ],
      });

      if (isWinner)
        await message.reply({
          embeds: [new Embed(colorConfig.color ?? '#fff').setDescription(`${winMsg}, you won **${giveaway.prize}**!`)],
          content: `${winMsg}`,
        });

      if (!isWinner)
        await message.reply({
          embeds: [
            new Embed(colorConfig.color ?? '#fff').setDescription(
              'There were not enough entries for a winner to be determined.',
            ),
          ],
        });

      giveaway.ended = true;
      await giveaway.save();
    })
    .catch(() => {});
}

module.exports = { endGiveaway };
