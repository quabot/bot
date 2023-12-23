import { hasSendPerms } from '@functions/discord';
import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  Colors,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  ModalSubmitInteraction,
} from 'discord.js';

export async function handleError(
  client: Client,
  error: any,
  interaction:
    | ButtonInteraction
    | ChatInputCommandInteraction
    | ContextMenuCommandInteraction
    | AnySelectMenuInteraction
    | ModalSubmitInteraction,
  location: string,
) {
  const blocked_codes = [
    4014, 10004, 10003, 10007, 10008, 10062, 30005, 30010, 30013, 40060, 50006, 50007, 50008, 240000, 200001, 200000,
  ];
  if (blocked_codes.includes(error.code)) return;

  if (error.code === 50001) {
    await handleInteractionReply(
      `An error occured! The bot doesn't have access to something that's used for this action (${location}).`,
    );

    return;
  }
  if (error.code === 50013) {
    await handleInteractionReply(
      `An error occured! The bot doesn't have all the permissions that are required for this action (${location}).`,
    );

    return;
  }

  console.log(error);

  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  const channel = guild?.channels.cache.get(process.env.ERROR_CHANNEL_ID!);
  if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
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

  async function handleInteractionReply(content: string) {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content,
      });
    } else {
      await interaction.reply({
        content,
        ephemeral: true,
      });
    }
  }
}
