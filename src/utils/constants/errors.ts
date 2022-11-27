import { Client, Colors, EmbedBuilder } from 'discord.js';

export const handleError = (client: Client, error: Error, location: string) => {
    console.log(error);

    const guild = client.guilds.cache.get('1007810461347086357');
    const channel: any = guild?.channels.cache.get('1044638906416648213');
    if (!channel) return;

    channel?.send({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Red)
                .setFooter({ text: error.name })
                .setTimestamp()
                .setDescription(`\`\`\`${error.message}\`\`\`\n**Location/Command:**\n\`${location}\``),
        ],
    });
};
