import type { Client } from '@classes/discord';
import Poll from '@schemas/Poll';
import { getPollConfig } from '@configs/pollConfig';
import { getServerConfig } from '@configs/serverConfig';
import { Embed } from '@constants/embed';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import type { IPoll } from '@typings/schemas';
import { ChannelType } from 'discord.js';

export async function endPoll(client: Client, document: NonNullMongooseReturn<IPoll>) {
  const query = {
    guildId: document.guildId,
    interaction: document.interaction,
  };

  const poll = await Poll.findOne(query);
  if (!poll) return;

  const guild = client.guilds.cache.get(poll.guildId);
  if (!guild) return;

  const channel = guild.channels.cache.get(poll.channel);
  if (!channel || channel.type === ChannelType.GuildCategory) return;

  const config = await getPollConfig(client, document.guildId);
  if (!config?.enabled) return;

  const colorConfig = await getServerConfig(client, document.guildId);
  if (!colorConfig) return;

  channel.messages
    .fetch(`${poll.message}`)
    .then(async message => {
      if (!message) return;

      const reactions = message.reactions.cache
        .each(async reaction => await reaction.users.fetch())
        .map(reaction => reaction.count)
        .flat();

      const winner = Math.max(...reactions);

      let winMsg;
      if (reactions[0] === winner) winMsg = poll.options[0];
      if (reactions[1] === winner) winMsg = poll.options[1];
      if (reactions[2] === winner) winMsg = poll.options[2];
      if (reactions[3] === winner) winMsg = poll.options[3];
      if (reactions[4] === winner) winMsg = poll.options[4];

      await message.edit({
        embeds: [
          new Embed(colorConfig.color)
            .setTitle(`${message.embeds[0].title}`)
            .setDescription(`${message.embeds[0].description}\n\nPoll is over, the poll was won by ${winMsg}!`)
            .addFields(
              {
                name: 'Hosted by',
                value: `${message.embeds[0].fields[0].value}`,
                inline: true,
              },
              { name: 'Winner', value: `${winMsg}`, inline: true },
              {
                name: 'Ended',
                value: `${message.embeds[0].fields[1].value}`,
                inline: true,
              },
            ),
        ],
      });
    })
    .catch(() => {});

  await Poll.findOneAndDelete(query);
}
