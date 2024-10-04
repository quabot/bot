import type { EventArgs } from '@typings/functionArgs';
import { ActivityType, Events } from 'discord.js';
import consola from 'consola';
import { getGuildCount, getUserCount } from '@constants/clientUtils';

export default {
  event: Events.ClientReady,
  once: true,
  async execute({ client }: EventArgs) {
    client.guilds.cache.forEach(guild => {
      guild.members.fetch().catch(() => {});
      guild.roles.fetch().catch(() => {});
    });

    function setActivity(activity: string) {
      client.user?.setActivity({ type: ActivityType.Watching, name: activity });
    }
    (async function loop() {
      const guildCount = await getGuildCount(client);
      const userCount = await getUserCount(client);
      setTimeout(function () {
        setActivity(`${guildCount.toLocaleString()} servers |  /help`);
      }, 10000);
      setTimeout(function () {
        setActivity(`${userCount.toLocaleString()} users |  /help`);
      }, 20000);
      setTimeout(function () {
        setActivity('quabot.net |  /help');
      }, 30000);
      setTimeout(function () {
        setActivity(`${client.commands.size} commands | /help`);
        loop();
      }, 40000);
    })();

    consola.log(`  Shard connected as '${client.user?.tag}'.`);
  },
};
