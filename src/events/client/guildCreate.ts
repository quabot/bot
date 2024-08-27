import type { EventArgs } from '@typings/functionArgs';
import { Guild } from 'discord.js';
import { getApplicationConfig } from '@configs/applicationConfig';
import { getAfkConfig } from '@configs/afkConfig';
import { getGiveawayConfig } from '@configs/giveawayConfig';
import { getLevelConfig } from '@configs/levelConfig';
import { getLoggingConfig } from '@configs/loggingConfig';
import { getIdConfig } from '@configs/idConfig';
import { getModerationConfig } from '@configs/moderationConfig';
import { getPollConfig } from '@configs/pollConfig';
import { getReactionConfig } from '@configs/reactionConfig';
import { getResponderConfig } from '@configs/responderConfig';
import { getServerConfig } from '@configs/serverConfig';
import { getSuggestConfig } from '@configs/suggestConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import { Embed } from '@constants/embed';
import { hasSendPerms } from '@functions/discord';
import { ChannelType } from 'discord.js';
import { getStarMessagesConfig } from '@configs/getStarMessagesConfig';
import { getBoostConfig } from '@configs/boostConfig';
import { getAutomodConfig } from '@configs/automodConfig';
import { getVerificationConfig } from '@configs/verificationConfig';

export default {
  event: 'guildCreate',
  name: 'guildCreate',
  /**
   * @param {Guild} guild
   */
  async execute({ client }: EventArgs, guild: Guild) {
    console.log(`Joined ${guild.name} (${guild.id})`);
    await getAfkConfig(guild.id, client);
    await getApplicationConfig(guild.id, client);
    await getGiveawayConfig(guild.id, client);
    await getLevelConfig(guild.id, client);
    await getLoggingConfig(client, guild.id);
    await getIdConfig(guild.id);
    await getModerationConfig(client, guild.id);
    await getPollConfig(client, guild.id);
    await getReactionConfig(client, guild.id);
    await getResponderConfig(client, guild.id);
    await getServerConfig(client, guild.id);
    await getSuggestConfig(client, guild.id);
    await getTicketConfig(client, guild.id);
    await getWelcomeConfig(client, guild.id);
    await getAutomodConfig(guild.id, client);
    await getStarMessagesConfig(guild.id, client);
    await getBoostConfig(guild.id, client);
    await getVerificationConfig(guild.id, client);

    let done = false;
    guild.channels.cache.forEach(channel => {
      if (
        channel.type === ChannelType.GuildText &&
        !done &&
        !channel.name.includes('rules') &&
        !channel.name.includes('announcements') &&
        !channel.name.includes('info') &&
        !channel.name.includes('information') &&
        hasSendPerms(channel)
      ) {
        done = true;
        channel
          .send({
            embeds: [
              new Embed('#416683')
                .setTitle("Hi, I'm QuaBot!")
                .setThumbnail(client.user!.displayAvatarURL({ forceStatic: false }))
                .setDescription(
                  "I'm a multipurpose Discord bot with loads of features. To configure me, go to [my dashboard](https://quabot.net/dashboard). If you need help with anything, join [my support server](https://discord.quabot.net).\nThanks for adding me to your server!",
                ),
            ],
          })
          .catch(() => {
            done = false;
          });
      }
    });

    guild.members.fetch().catch(() => {});
  },
};
