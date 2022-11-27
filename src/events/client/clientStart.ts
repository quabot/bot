import { type Client, ActivityType } from 'discord.js';
import consola from 'consola';
import { commands } from '../../main';

module.exports = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        function setActivity(activity: string) {
            client.user?.setActivity({ type: ActivityType.Watching, name: activity });
        }

        const activities = [
            `${client.users.cache.size.toLocaleString()} users`,
            `quabot.net`,
            `${commands.size} commands`,
            `${client.guilds.cache.size} servers`,
        ];

        setActivity(`${activities[0]} | /help`);
        let activityCount = 1;

        setInterval(() => {
            setActivity(
                `${activities[activityCount < activities.length ? activityCount++ : (activityCount = 0)]} | /help`
            );
        }, 6000);

        console.log('');
        consola.info(`Logged in as ${client.user?.tag}.`);
        setTimeout(() => {
            console.log('');
            consola.success(`Ready!`);
        }, 1000);
    },
};
