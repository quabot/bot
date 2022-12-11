import { type Client, Colors, EmbedBuilder, type BaseGuildTextChannel } from 'discord.js';
import consola from 'consola';
export * from './discord';
export * from './mongoose';

export async function handleError(client: Client, error: Error, location?: string) {
    consola.error(error);

    const guild = await client.guilds.fetch('1007810461347086357');
    const channel: BaseGuildTextChannel = guild?.channels.cache.get('1044638906416648213') as BaseGuildTextChannel;

    channel?.send({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Red)
                .setFooter({ text: error.name })
                .setTimestamp()
                .setDescription(
                    `\`\`\`js${error.message}\`\`\`\n**Location/Command:**\n\`\`\`js${location ?? error.stack}\`\`\``
                ),
        ],
    });
}
