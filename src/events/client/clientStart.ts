import type { EventArgs } from '@typings/functionArgs';
import { ActivityType } from 'discord.js';
import consola from 'consola';

export default {
  event: 'ready',
  name: 'clientStart',
  once: true,

  async execute({ client }: EventArgs) {
    //* If the year is 2025, stop.
    if (new Date().getFullYear() === 2025) {
      consola.info('QuaBot has stopped operation. We recommend switching to ProBot (https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.');
      
      client.user?.setPresence({ status: 'invisible' });
      client.user?.setActivity({ type: ActivityType.Watching, name: 'thank you for 3 years of operation', state: 'QuaBot has been shut down.' });
    }
    if (new Date().getFullYear() === 2025) return;

    client.guilds.cache.forEach(guild => {
      guild.members.fetch().catch(() => {});
      guild.roles.fetch();
    });

    function setActivity(activity: string) {
      client.user?.setPresence({ status: 'idle' });
      client.user?.setActivity({ type: ActivityType.Watching, name: activity, state: 'QuaBot is shutting down on January 1, 2025' });
      //* set idle
    }
    (function loop() {
      setTimeout(function () {
        //* if 2025, kill process
        if (new Date().getFullYear() === 2025) {
          process.exit(0);
        }
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
