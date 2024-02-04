import { hasSendPerms } from '@functions/discord';
import { Client, Colors, EmbedBuilder } from 'discord.js';

export async function handleError(client: Client, error: any, location: string) {
  const blocked_codes = [
    4014, 10004, 10003, 10007, 10008, 10062, 30005, 30010, 30013, 40060, 50006, 50007, 50008, 240000, 200001, 200000,
  ];
  if (blocked_codes.includes(error.code)) return;

  console.log(error);

  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  const channel = guild?.channels.cache.get(process.env.ERROR_CHANNEL_ID!);
  if (!channel?.isTextBased()) return;
  if (!hasSendPerms(channel)) return;

  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(Colors.Red)
        .setFooter({ text: error.name })
        .setTimestamp()
        .setDescription(`\`\`\`${error.message}\`\`\`\n**Location/Command:**\n\`${location}\``),
    ],
  });
}
