const fs = require('fs');
const consola = require('consola')

module.exports = (client, Discord) => {
    const eventFolders = fs.readdirSync('./events');
    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(`./events/${folder}`).filter(files => files.endsWith('.js'));
        for(const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event,execute(...args, client, Discord));
            } else {
                client.once(event.name, (...args) => event,execute(...args, client, Discord));
            }
        }
    }
}