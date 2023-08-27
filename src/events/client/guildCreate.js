const { Guild, ChannelType } = require("discord.js");
const { getApplicationConfig } = require("@configs/applicationConfig");
const { getAfkConfig } = require("@configs/afkConfig");
const { getGiveawayConfig } = require("@configs/giveawayConfig");
const { getLevelConfig } = require("@configs/levelConfig");
const { getLoggingConfig } = require("@configs/loggingConfig");
const { getIdConfig } = require("@configs/idConfig");
const { getModerationConfig } = require("@configs/moderationConfig");
const { getPollConfig } = require("@configs/pollConfig");
const { getReactionConfig } = require("@configs/reactionConfig");
const { getResponderConfig } = require("@configs/responderConfig");
const { getServerConfig } = require("@configs/serverConfig");
const { getSuggestConfig } = require("@configs/suggestConfig");
const { getTicketConfig } = require("@configs/ticketConfig");
const { getWelcomeConfig } = require("@configs/welcomeConfig");
const { Embed } = require("@constants/embed");

module.exports = {
  event: "guildCreate",
  name: "guildCreate",
  /**
   * @param {Guild} guild
   */
  async execute(guild, client) {
    console.log(`Joined ${guild.name} (${guild.id})`);
    await getAfkConfig(guild.id, client);
    await getApplicationConfig(guild.id, client);
    await getGiveawayConfig(client, guild.id);
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

    let done = false;
    guild.channels.cache.forEach((channel) => {
      if (
        channel.type === ChannelType.GuildText &&
        !done &&
        !channel.name.includes("rules") &&
        !channel.name.includes("announcements") &&
        !channel.name.includes("info") &&
        !channel.name.includes("information")
      ) {
        done = true;
        channel
          .send({
            embeds: [
              new Embed("#416683")
                .setTitle("Hi, I'm QuaBot!")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
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
