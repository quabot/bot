import type { Client } from '@classes/discord';
import Poll from '@schemas/Poll';
import { getPollConfig } from '@configs/pollConfig';
import { getServerConfig } from '@configs/serverConfig';
import { Embed } from '@constants/embed';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import type { IPoll } from '@typings/schemas';
import { ChannelType } from 'discord.js';

export async function endPoll(client: Client, document: NonNullMongooseReturn<IPoll>, forceEarly: boolean = false) {
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
        .map(r => r)
        .map((reaction, i) => {
          return { i, amount: reaction.count };
        })
        .flat();

      const options = poll.options!;
      const winner = Math.max(...reactions.map(r => r.amount));
      const winners = reactions.filter(r => r.amount === winner);

      let winMsg: string = '';

      winMsg = winners.map(w => options[w.i]).join('\n- ');

      await message.edit({
        embeds: [
          new Embed(colorConfig.color)
            .setTitle(`${message.embeds[0].title}`)
            .setDescription(`${message.embeds[0].description}\n\nPoll has been ended!`)
            .addFields(
              {
                name: 'Hosted by',
                value: `${message.embeds[0].fields[0].value}`,
                inline: true,
              },
              { name: 'Winner' + (winners.length > 1 ? 's' : ''), value: `- ${winMsg}`, inline: true },
              {
                name: 'Ended',
                value: forceEarly
                  ? `<t:${Math.floor(new Date().getTime() / 1000)}:R>`
                  : message.embeds[0].fields[1].value,
                inline: true,
              },
            ),
        ],
      });
    })
    .catch(() => {});

  await Poll.findOneAndDelete(query);
}
