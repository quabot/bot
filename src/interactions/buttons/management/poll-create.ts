import type { ButtonArgs } from '@typings/functionArgs';
import Poll from '@schemas/Poll';
import { Embed } from '@constants/embed';
import { endPoll } from '@functions/poll';
import {
  NewsChannel,
  TextChannel,
  MessageCreateOptions,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import ms from 'ms';
import { getPollConfig } from '@configs/pollConfig';
import { hasSendPerms } from '@functions/discord';

export default {
  name: 'create-poll',

  async execute({ interaction, color, client }: ButtonArgs) {
    const config = await getPollConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
        ephemeral: true,
      });

    const document = await Poll.findOne({
      guildId: interaction.guildId,
      interaction: interaction.message.id,
    });
    if (!document) {
      await interaction.reply({
        embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
        ephemeral: true,
      });
      return;
    }

    if (!document.topic || !document.description || document.options?.length == 0) {
      await interaction.reply({
        embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
        ephemeral: true,
      });
      return;
    }

    let description = document.description;
    for (let index = 0; index < (document.options?.length ?? 0); index++) {
      const option = (document.options ?? [])[index];
      const emoji = `${index}`
        .replace('0', ':one:')
        .replace('1', ':two:')
        .replace('2', ':three:')
        .replace('3', ':four:')
        .replace('4', ':five:');
      if (description) description = `${description}\n${emoji} - ${option}`;
    }

    const embed = new Embed(color)
      .setTitle(`${document.topic}`)
      .setDescription(`${description}`)
      .addFields(
        { name: 'Hosted by', value: `${interaction.user}`, inline: true },
        {
          name: 'Ends in',
          value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(document.duration) / 1000)}:R>`,
          inline: true,
        },
      )
      .setFooter({ text: `ID: ${document.id}` });

    const ch = interaction.guild?.channels.cache.get(document.channel) as TextChannel | NewsChannel;
    if (!ch)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "Couldn't find the poll channel. Are sure it still exists and that I have access to it?",
          ),
        ],
        ephemeral: true,
      });
    if (!hasSendPerms(ch))
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "Can't send a message in the poll channel. I don't have the `SendMessages` permission.",
          ),
        ],
        ephemeral: true,
      });

    const msgOptions: MessageCreateOptions = { embeds: [embed] };

    if (document.role) msgOptions.content = document.role;

    const msg = await ch.send(msgOptions);
    if (!msg) {
      await interaction.reply({
        embeds: [new Embed(color).setDescription('Failed to send the interaction.message in the channel.')],
        ephemeral: true,
      });
      return;
    }

    for (let ia = 0; ia < document.optionsCount; ia++) {
      const reactionEmoji = `${ia + 1}`;

      msg.react(
        `${reactionEmoji
          .replace('1', '1️⃣')
          .replace('2', '2️⃣')
          .replace('3', '3️⃣')
          .replace('4', '4️⃣')
          .replace('5', '5️⃣')}`,
      );
    }

    await document.updateOne({
      message: msg.id,
      endTimestamp: Math.round(new Date().getTime()) + Math.round(ms(document.duration)),
      created: new Date().getTime(),
    });

    setTimeout(async () => {
      await endPoll(client, document);
    }, ms(document.duration));

    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              style: ButtonStyle.Primary,
              label: 'Enter Details',
              customId: 'details-poll',
              disabled: true,
            }),
            new ButtonBuilder({
              style: ButtonStyle.Secondary,
              label: 'Enter Choices',
              customId: 'choices-poll',
              disabled: true,
            }),
            new ButtonBuilder({
              style: ButtonStyle.Success,
              label: 'Create Poll',
              customId: 'create-poll',
              disabled: true,
            }),
            new ButtonBuilder({
              style: ButtonStyle.Danger,
              label: 'Cancel',
              customId: 'cancel-poll',
              disabled: true,
            }),
          ],
        }),
      ],
    });

    await interaction.followUp({
      embeds: [
        new Embed(color).setDescription(
          `The poll has started in ${ch}! [Click here](${msg.url}) to jump to the message.`,
        ),
      ],
      ephemeral: true,
    });

    if (!config.logEnabled) return;
    const logChannel = interaction.guild?.channels.cache.get(config.logChannel);
    if (!logChannel?.isTextBased()) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log, I don't have the `SendMessages` permission.")],
        ephemeral: true,
      });

    await logChannel.send({
      embeds: [
        new Embed(color).setTitle('New Poll!').addFields(
          { name: 'Question', value: `${document.topic}` },
          { name: 'Description', value: `${document.description}` },
          { name: 'Options', value: `${document.optionsCount}` },
          { name: 'Created by', value: `${interaction.user}`, inline: true },
          {
            name: 'Ends in',
            value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(document.duration) / 1000)}:R>`,
            inline: true,
          },
          {
            name: 'message',
            value: `[Click to jump](${msg.url})`,
            inline: true,
          },
        ),
      ],
    });
  },
};
