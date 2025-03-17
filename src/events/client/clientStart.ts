import type { EventArgs } from '@typings/functionArgs';
import { ActivityType } from 'discord.js';
import consola from 'consola';

export default {
  event: 'ready',
  name: 'clientStart',
  once: true,

  async execute({ client }: EventArgs) {
    client.guilds.cache.forEach(guild => {
      guild.members.fetch().catch(() => {});
      guild.roles.fetch();
    });

    function setActivity(activity: string) {
      client.user?.setActivity({ type: ActivityType.Watching, name: activity, state: 'idle' });
    }
    (function loop() {
      setTimeout(function () {
        setActivity('shutting down | /about');
      }, 10000);
      setTimeout(function () {
        setActivity('shutting down | /about');
      }, 20000);
      setTimeout(function () {
        setActivity('shutting down | /about');
      }, 30000);
      setTimeout(function () {
        setActivity('shutting down | /about');
        loop();
      }, 40000);
    })();

    consola.info(`Logged in as '${client.user?.tag}'.`);
  },
};
