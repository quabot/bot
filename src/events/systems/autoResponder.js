const { Client, Message } = require('discord.js');
const { CustomEmbed } = require('../../utils/constants/customEmbed');
const Responder = require('../../structures/schemas/Responder');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { getResponderConfig } = require('../../utils/configs/responderConfig');

module.exports = {
    event: "messageCreate",
    name: "autoReponder",
    /**
    * @param {Message} message
    * @param {Client} client 
    */
    async execute(message, client) {
        if (message.author.bot) return;

        const respondConfig = await getResponderConfig(client, message.guildId);
        if (!respondConfig.enabled) return;
        
        const configColor = await getServerConfig(client, message.guildId);
        const color = configColor?.color ?? '#3a5a74';

        const commands_list = client.custom_commands.filter(c => c.guildId === message.guildId);
        commands_list.forEach(async cL => {
            let run = false;
            if (!cL.wildcard && cL.trigger === message.content) run = true;
            if (cL.wildcard && message.content.includes(cL.trigger)) run = true;


            if (cL.ignored_channels.includes(message.channel.id)) run = false;
            cL.ignored_roles.forEach(r => {
                if (message.member.roles.cache.has(r)) run = false;
            });

            if (run) runTrigger(cL)
        });

        async function runTrigger(document) {
            const parse = (s) => { return `${s}`.replaceAll('{color}', `${color}`).replaceAll('{guild}', `${message.guild.name}`).replaceAll('{server}', `${message.guild.name}`).replaceAll('{members}', `${message.guild.memberCount}`).replaceAll('{user}', message.author).replaceAll('{username}', message.author.username).replaceAll('{tag}', message.author.tag); }

            if (document.type === 'message') {
                await message.reply({ content: parse(document.message) ?? '** **', allowedMentions: false });
            } else if (document.type === 'reaction') {
                await message.react(document.reaction);
            } else if (document.type === 'embed') {
                console.log(document)
                const embed = new CustomEmbed(document.embed, parse);
                await message.reply({ embeds: [embed], content: parse(document.embed.content) });
            }
        }
    }
}