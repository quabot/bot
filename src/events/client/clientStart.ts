import { Client, ActivityType } from 'discord.js';
import consola from 'consola';
import { commands } from '../../main';

module.exports = {
    event: 'ready',
    once: true,
    async execute(client: Client) {
        function setActivity(activity: string) {
            client.user?.setActivity({ type: ActivityType.Watching, name: activity });
        }

        (function loop() {
            setTimeout(function () {
                setActivity(`${client.users.cache.size.toLocaleString()} users |  /help`);
            }, 6000);
            setTimeout(function () {
                setActivity(`quabot.net | /help`);
            }, 12000);
            setTimeout(function () {
                setActivity(`${commands.size} commands | /help`);
            }, 18000);
            setTimeout(function () {
                setActivity(`${client.guilds.cache.size} servers |  /help`);
                loop();
            }, 24000);
        })();

        console.log('');
        consola.info(`Logged in as ${client.user?.tag}.`);
        setTimeout(() => {
            console.log('');
            consola.success(`Ready!`);
        }, 1000);
    },
};
