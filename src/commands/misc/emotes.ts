import { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, Colors, SlashCommandBuilder } from 'discord.js';
import type { CommandArgs } from '@typings/functionArgs';
import { Embed } from '@constants/embed';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('emotes')
    .setDescription('List all the server emojis.')
    .setDMPermission(false),

  async execute({ interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply({ ephemeral: true });

    //* Create an array of all the emojis in the guild.
    const emoteList = (await interaction.guild!.emojis.fetch()).map(emoji => emoji);

    if (!emoteList.length) return interaction.editReply({
      embeds: [
        new Embed(color)
          .setDescription('There are no custom emojis in this server.')
      ]
    });

    //* Create the multi-page system.
    // ? don't touch it lol
    const backId = 'backMusic';
    const forwardId = 'forwardMusic';
    const backButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Back',
      emoji: '⬅️',
      customId: backId,
    });
    const forwardButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Forward',
      emoji: '➡️',
      customId: forwardId,
    });

    const makeEmbed = async (start: number) => {
      const current = emoteList.slice(start, start + 10);

      return new EmbedBuilder({
        color: Colors.Green,
        timestamp: Date.now(),
        title: `Emotes ${start + 1}-${start + 10}/${emoteList.length}`,
        fields: await Promise.all(
          current.map(async emote => {
            return {
              name: `${emote.name}`,
              value: `${emote}`,
              inline: true,
            };
          }),
        ),
      });
    };

    let currentIndex = 0;

    const canFit = emoteList.length <= 10;
    const msg = await interaction.editReply({
      embeds: [await makeEmbed(0)],
      components: canFit ? [] : [new ActionRowBuilder<ButtonBuilder>({ components: [forwardButton] })],
    });
    if (canFit) return;

    const collector = msg.createMessageComponentCollector({
      filter: ({ user }) => user.id === user.id,
    });

    collector.on('collect', async i => {
      i.customId === backId ? (currentIndex -= 10) : (currentIndex += 10);
      await i.update({
        embeds: [await makeEmbed(currentIndex)],
        components: [
          new ActionRowBuilder<ButtonBuilder>({
            components: [
              ...(currentIndex ? [backButton] : []),
              ...(currentIndex + 10 < emoteList.length ? [forwardButton] : []),
            ],
          }),
        ],
      });
    });
  },
};
