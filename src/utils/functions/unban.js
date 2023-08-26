const { getModerationConfig } = require('../configs/moderationConfig');
const { getServerConfig } = require('../configs/serverConfig');
const { Embed } = require('../constants/embed');

async function tempUnban(client, document) {
  const Punishment = require('@schemas/Punishment');
  const guild = client.guilds.cache.get(`${document.guildId}`);
  if (!guild) return;

  await guild.bans.fetch(document.userId).catch(err => {
    return;
  });

  guild.members.unban(document.userId).catch(err => {
    if (err.code !== 50035) return;
  });

  const p = await Punishment.findOne({
    guildId: document.guildId,
    userId: document.userId,
    id: document.id,
  });

  p.active = false;
  await p.save();

  const colorConfig = await getServerConfig(client, document.guildId);

  const moderationConfig = await getModerationConfig(client, document.guildId);

  const logChannel = guild.channels.cache.get(`${moderationConfig.channelId}`);
  await logChannel.send({
    embeds: [
      new Embed(colorConfig.color ?? '#fff')
        .setTitle('Member Auto-Unbanned')
        .addFields(
          { name: 'User', value: `<@${document.userId}>`, inline: true },
          { name: 'Unbanned After', value: `${document.duration}`, inline: true },
          { name: 'Ban-Id', value: `${document.id}`, inline: true },
        ),
    ],
  });
}

module.exports = { tempUnban };
