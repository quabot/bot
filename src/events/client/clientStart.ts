import { type Client, ActivityType } from 'discord.js';
import consola from 'consola';
import { Event, EventArgs } from '../../structures';

export default new Event()
    .setName('ready')
    .setOnce(true)
    .setCallback(async ({ client }: EventArgs, onlineClient: Client) => {
        const activities = [`{usersCount} users`, `quabot.net`, `{commandsCount} commands`, `{guildsCount} servers`];

        setActivity(activities[0]);
        let activityCount = 1;

        setInterval(() => {
            setActivity(activities[activityCount < activities.length ? activityCount++ : (activityCount = 0)]);
        }, 6000);

        console.log('');
        consola.info(`Logged in as ${onlineClient.user?.tag}.`);
        setTimeout(() => {
            console.log('');
            consola.success(`Ready!`);
        }, 1000);

        function setActivity(activity: any) {
            onlineClient.user?.setActivity({
                type: ActivityType.Watching,
                name: `${activity
                    .replaceAll('{usersCount}', onlineClient.users.cache.size.toLocaleString())
                    .replaceAll('{commandsCount}', client.commands.size.toLocaleString())
                    .replaceAll('{guildsCount}', onlineClient.guilds.cache.size.toLocaleString())} | /help`,
            });
        }
    });
