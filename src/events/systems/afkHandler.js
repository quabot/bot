const { Client, Message } = require('discord.js');
const { getUser } = require('../../utils/configs/user');
const { Embed } = require('../../utils/constants/embed');
const { getServerConfig } = require('../../utils/configs/serverConfig');

module.exports = {
    event: "messageCreate",
    name: "afkHandler",
    /**
	* @param {Message} message
    * @param {Client} client 
    */
    async execute(message, client) {
        if (message.author.bot) return;
        
		const user = message.mentions.users.first();
        if (!user) return;
        if (user.bot) return;

        const config = await getUser(message.guildId, user.id);
        const configColor = await getServerConfig(client, message.guildId);
        const color = configColor?.color ?? '#3a5a74';
        if (!config || !color) return;
        

        if (config.userId === user.id) return;
        
        if (config.afk) {
            message.reply({
                embeds: [
                    new Embed(color)
                        .setDescription(`${user.tag} is afk.\n\`${config.afkMessage}\``)
                ]
            });
        }
    }
}