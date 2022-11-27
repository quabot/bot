import { type Client, ActivityType } from 'discord.js';
import consola from 'consola';
import { commands } from '../../main';

module.exports = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        function setActivity(activity: any) {
            client.user?.setActivity({
                type: ActivityType.Watching,
                name: `${activity
                    .replaceAll('{usersCount}', client.users.cache.size.toLocaleString())
                    .replaceAll('{commandsCount}', commands.size.toLocaleString())
                    .replaceAll('{guildsCount}', client.guilds.cache.size.toLocaleString())} | /help`,
            });
        }

        const activities = [`{usersCount} users`, `quabot.net`, `{commandsCount} commands`, `{guildsCount} servers`];

        setActivity(activities[0]);
        let activityCount = 1;

        setInterval(() => {
            setActivity(activities[activityCount < activities.length ? activityCount++ : (activityCount = 0)]);
        }, 6000);

        console.log('');
        consola.info(`Logged in as ${client.user?.tag}.`);
        setTimeout(() => {
            console.log('');
            consola.success(`Ready!`);
        }, 1000);
    },
};
