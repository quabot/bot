import {
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageCreateOptions,
} from 'discord.js';
import ms from 'ms';
const Poll = require('@schemas/Poll');
import { getIdConfig } from '@configs/idConfig';
import { getPollConfig } from '@configs/pollConfig';
import { Embed } from '@constants/embed';
const { endPoll } = require('@functions/poll');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'poll',
  name: 'create',

  async execute({ client, interaction, color }: CommandArgs) {
    const config = await getPollConfig(client, interaction.guildId!);
    const ids = await getIdConfig(interaction.guildId!);
    if (!config || !ids)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Polls are not enabled in this server.')],
      });

    const channel = interaction.options.getChannel('channel');
    let choices = interaction.options.getNumber('choices');
    const duration = interaction.options.getString('duration');
    const role = interaction.options.getRole('role-mention') ?? null;

    if (!channel || !choices || !duration)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please enter all the required fields.')],
      });

    if (channel.type !== ChannelType.GuildAnnouncement && channel.type !== ChannelType.GuildText)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please create the poll in either a text or announcement channel.')],
      });

    if (choices < 2) choices = 2;
    if (choices > 5) choices = 5;

    if (!ms(duration))
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please enter a valid duration. Eg. 1h, 5m, 1d etc.')],
      });

    if (ms(duration) > 2147483647)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Please enter a value that is below 24 days.')],
      });

    const message = await interaction.reply({
      embeds: [
        new Embed(color)
          .setDescription(
            'Click the blue button below this message to enter the details for the poll. When entered, click the gray button to enter the choices.',
          )
          .addFields(
            { name: 'Channel', value: `${channel}`, inline: true },
            { name: 'Duration', value: `${duration}`, inline: true },
            { name: 'Choices', value: `${choices}`, inline: true },
            { name: 'Role', value: `${role ? role : 'None'}`, inline: true },
          ),
      ],
      ephemeral: true,
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              style: ButtonStyle.Primary,
              label: 'Enter Details',
              customId: 'details-poll',
            }),
            new ButtonBuilder({
              style: ButtonStyle.Secondary,
              label: 'Enter Choices',
              customId: 'choices-poll',
            }),
            new ButtonBuilder({
              style: ButtonStyle.Success,
              label: 'Create Poll',
              customId: 'create-poll',
            }),
            new ButtonBuilder({
              style: ButtonStyle.Danger,
              label: 'Cancel',
              customId: 'cancel-poll',
            }),
          ],
        }),
      ],
      fetchReply: true,
    });

    if (!message)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(`I do not have the required permissions to send messages in ${channel}.`),
        ],
      });

    const collector = message.createMessageComponentCollector({
      filter: ({ user }) => user.id === interaction.user.id,
      time: 60000,
    });

    collector.on('collect', async i => {
      if (i.customId === 'details-poll') {
        const document = await Poll.findOne({
          guildId: i.guildId,
          interaction: message.id,
        });

        const modal = new ModalBuilder()
          .setTitle('Configure Poll')
          .setCustomId('info-poll')
          .setComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('question')
                .setPlaceholder('Poll Question...')
                .setLabel('Poll Question')
                .setMaxLength(256)
                .setValue(document ? (document.topic === 'none' ? '' : document.topic) : '')
                .setRequired(true)
                .setStyle(TextInputStyle.Short),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('description')
                .setPlaceholder('Poll description...')
                .setLabel('Poll Description')
                .setValue(document ? (document.description === 'none' ? '' : document.description) : '')
                .setMaxLength(250)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),
            ),
          );

        await i.showModal(modal);

        if (document) return;

        const newPoll = new Poll({
          guildId: i.guildId,
          id: ids.pollId,
          channel: channel.id,
          message: 'none',
          interaction: message.id,
          role,

          topic: 'none',
          description: 'none',

          duration: duration,
          optionsCount: choices,
          options: [],

          created: 0,
          endTimestamp: 0,
        });
        await newPoll.save();
      } else if (i.customId === 'cancel-poll') {
        const document = await Poll.findOne({
          guildId: i.guildId,
          interaction: message.id,
        });

        await i.update({
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

        if (document) {
          await Poll.findOneAndDelete({
            guildId: i.guildId,
            interaction: message.id,
          });
        }
      } else if (i.customId === 'create-poll') {
        const document = await Poll.findOne({
          guildId: i.guildId,
          interaction: message.id,
        });
        if (!document) {
          await i.reply({
            embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
            ephemeral: true,
          });
          return;
        }

        if (!document.topic || !document.description || document.options.length === 0) {
          await i.reply({
            embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
            ephemeral: true,
          });
          return;
        }

        let description = document.description;
        for (let index = 0; index < document.options.length; index++) {
          const option = document.options[index];
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
            { name: 'Hosted by', value: `${i.user}`, inline: true },
            {
              name: 'Ends in',
              value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(document.duration) / 1000)}:R>`,
              inline: true,
            },
          )
          .setFooter({ text: `ID: ${document.id}` });

        const ch = i.guild?.channels.cache.get(document.channel);
        if (!ch) {
          await i.reply({
            embeds: [
              new Embed(color).setDescription(
                "Couldn't find the poll channel. Are sure it still exists and that I have access to it?",
              ),
            ],
            ephemeral: true,
          });
          return;
        }

        if (ch.type === ChannelType.GuildCategory || ch.type === ChannelType.GuildForum) {
          await i.reply({
            embeds: [new Embed(color).setDescription("Can't send a message in this type of channel.")],
            ephemeral: true,
          });
          return;
        }

        const msgOptions: MessageCreateOptions = { embeds: [embed] };

        if (document.role) msgOptions.content = document.role;

        const msg = await ch.send(msgOptions);
        if (!msg) {
          await i.reply({
            embeds: [new Embed(color).setDescription('Failed to send the message in the channel.')],
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
        }, ms(duration));

        await i.update({
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

        await i.followUp({
          embeds: [
            new Embed(color).setDescription(
              `The poll has started in ${ch}! [Click here](${msg.url}) to jump to the message.`,
            ),
          ],
          ephemeral: true,
        });

        if (!config.logEnabled) return;
        const logChannel = i.guild.channels.cache.get(config.logChannel);
        if (!logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum)
          return;

        await logChannel.send({
          embeds: [
            new Embed(color).setTitle('New Poll!').addFields(
              { name: 'Question', value: `${document.topic}` },
              { name: 'Description', value: `${document.description}` },
              { name: 'Options', value: `${document.optionsCount}` },
              { name: 'Created by', value: `${i.user}`, inline: true },
              {
                name: 'Ends in',
                value: `<t:${Math.round(new Date().getTime() / 1000) + Math.round(ms(document.duration) / 1000)}:R>`,
                inline: true,
              },
              {
                name: 'Message',
                value: `[Click to jump](${msg.url})`,
                inline: true,
              },
            ),
          ],
        });
      } else {
        const document = await Poll.findOne({
          guildId: i.guildId,
          interaction: message.id,
        });

        const modal = new ModalBuilder().setTitle('Configure Poll').setCustomId('choices-poll');

        for (let index = 0; index < choices; index++)
          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId(`${index}`)
                .setLabel(`Option ${index + 1}`)
                .setRequired(true)
                .setMaxLength(180)
                .setValue(document ? `${document.options[index] ? document.options[index] : ''}` : '')
                .setStyle(TextInputStyle.Short),
            ),
          );

        await i.showModal(modal);

        if (document) return;

        const newPoll = new Poll({
          guildId: i.guildId,
          id: ids.pollId,
          channel: channel.id,
          message: 'none',
          interaction: message.id,
          role: role,

          topic: 'none',
          description: 'none',

          duration: duration,
          optionsCount: choices,
          options: [],

          created: 0,
          endTimestamp: 0,
        });
        await newPoll.save();
      }
    });
  },
};
