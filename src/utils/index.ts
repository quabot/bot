import { type Client, Colors, EmbedBuilder, type BaseGuildTextChannel } from 'discord.js';
import consola from 'consola';
export * from './discord';
export * from './mongoose';

export async function handleError(client: Client, error: Error, location?: string) {
    consola.error(error);

    const guild = await client.guilds.fetch(process.env.GUILD_ID ?? '');
    const channel: BaseGuildTextChannel = (await guild?.channels.fetch(
        process.env.LOG_CHANNEL_ID ?? ''
    )) as BaseGuildTextChannel;

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
