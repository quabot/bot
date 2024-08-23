import { getModerationConfig } from '@configs/moderationConfig';
import { Embed } from '@constants/embed';
import Punishment from '@schemas/Punishment';
import PunishmentAppeal from '@schemas/PunishmentAppeal';
import type { ButtonArgs } from '@typings/functionArgs';
import {
  ActionRowBuilder,
  ActionRowData,
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  JSONEncodable,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export default {
  name: 'punishment-appeal',
  async execute({ interaction, color, client }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });
    const punishment = await Punishment.findOne({
      id: interaction.message.embeds[0].footer?.text,
    });
    if (!punishment)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const appeal = await PunishmentAppeal.findOne({ punishmentId: punishment.id });
    if (appeal)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You have already appealed this punishment.')],
      });

    const config = await getModerationConfig(client, punishment.guildId);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    interface Page {
      embeds: Embed[];
      components: (
        | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
        | ActionRowData<MessageActionRowComponentData | MessageActionRowComponentBuilder>
        | APIActionRowComponent<APIMessageActionRowComponent>
      )[];
    }

    const answers: string[] = [];

    let pages: Page[] = config.appealQuestions!.map((question, i) => {
      const message: Page = {
        embeds: [new Embed(color).setDescription(question)],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setEmoji('⬅️')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('previous')
              .setDisabled(i === 0),
            new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Primary).setCustomId('next'),
          ),
        ],
      };

      message.components?.push(
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setLabel('Answer').setStyle(ButtonStyle.Secondary).setCustomId(i.toString()),
        ),
      );

      return message;
    });

    pages.push({
      embeds: [
        new Embed(color)
          .setTitle('There are no more questions!')
          .setDescription(
            "If you click the green submit button below, you appeal will be sent to the staff and you won't be able to change your answers!",
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setEmoji('⬅️').setStyle(ButtonStyle.Primary).setCustomId('previous'),
          new ButtonBuilder().setEmoji('➡️').setStyle(ButtonStyle.Primary).setCustomId('next').setDisabled(true),
        ),
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setLabel('Submit').setStyle(ButtonStyle.Success).setCustomId('submit'),
        ),
      ],
    });

    let page = 0;
    const initMsg = await updatePage();
    const pageCollector = initMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: i => ['previous', 'next'].includes(i.customId),
    });
    const answerCollector = initMsg.createMessageComponentCollector({
      filter: i => !['submit', 'previous', 'next'].includes(i.customId),
    });
    const submitCollector = initMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: i => i.customId === 'submit',
    });

    answerCollector.on('collect', async inter => {
      const i = parseInt(inter.customId);

      if (inter.isButton()) {
        const customId = `punishments-appeal-${i}`;

        await inter.showModal(
          new ModalBuilder()
            .setTitle('Your answer')
            .setCustomId(customId)
            .setComponents(
              new ActionRowBuilder<TextInputBuilder>().setComponents(
                new TextInputBuilder()
                  .setLabel('Answer')
                  .setPlaceholder('Your answer...')
                  .setStyle(TextInputStyle.Paragraph)
                  .setRequired(true)
                  .setValue(answers[i] ?? '')
                  .setMaxLength(500)
                  .setCustomId('value'),
              ),
            ),
        );

        const modal = await interaction
          .awaitModalSubmit({
            time: 24 * 60 * 60 * 1000,
            filter: i => i.customId === customId,
          })
          .catch(() => null);

        if (modal) {
          await handleAnswer(modal, i, [modal.fields.getTextInputValue('value')]);
        }

        return;
      }

      if (!inter.isStringSelectMenu()) return;
      await handleAnswer(inter, i, inter.values);
    });

    submitCollector.on('collect', async inter => {
      const invalid = config.appealQuestions.filter((_, i) => (answers[i] ? answers[i].length === 0 : true));
      if (invalid.length > 0) {
        await inter.reply({
          embeds: [
            new Embed(Colors.Red).setDescription(
              `You haven't filled out all of the required questions yet!\n Question(s) ${config.appealQuestions
                .filter((_, i) => (answers[i] ? answers[i].length === 0 : true))
                .map(q => config.appealQuestions.indexOf(q) + 1)
                .join(', ')} haven't been answered yet!`,
            ),
          ],
          ephemeral: true,
        }).catch(() => {});

        return;
      }

      await new PunishmentAppeal({
        guildId: punishment.guildId!,
        answers,
        userId: interaction.user.id,
        punishmentId: punishment.id,
        response: 'none',
        state: 'pending',
        type: punishment.type,
      }).save();

      submitCollector.stop();

      await inter.update({
        embeds: [new Embed(color).setDescription('Your punishment appeal has been submitted.')],
        components: [],
      });

      const guild = client.guilds.cache.get(punishment.guildId!);
      const submission_channel = guild?.channels.cache.get(config.appealChannelId);
      if (!submission_channel?.isTextBased()) return;

      await submission_channel.send({
        embeds: [
          new Embed(Colors.Grey)
            .setTitle('New punishment appeal submitted!')
            .setDescription(
              `**${interaction.user}** has submitted a punishment appeal!\nClick on the buttons below this message to view, approve or deny the appeal.`,
            )
            .setFooter({ text: `${punishment.id}` }),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder().setCustomId('appeal-view').setLabel('View answers').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('appeal-accept').setLabel('Accept and revoke punishment').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('appeal-deny').setLabel('Deny and keep punishment').setStyle(ButtonStyle.Danger),
          ),
        ],
      });
    });

    pageCollector.on('collect', async inter => {
      await inter.deferReply({ ephemeral: true });

      switch (inter.customId) {
        case 'previous': {
          page--;
          break;
        }

        case 'next': {
          page++;
          break;
        }
      }

      await updatePage();
      await inter.deleteReply();
    });

    async function handleAnswer(
      interaction: ModalSubmitInteraction | StringSelectMenuInteraction,
      i: number,
      answer: string[],
    ) {
      answers[i] = answer[0];

      await interaction.deferReply({ ephemeral: true });

      pages[i].embeds[0].setFields([{
        name: 'Answer',
        value: answer[0] ?? 'No answer.',
      }]);

      await updatePage();
      await interaction.deleteReply();
    }

    async function updatePage() {
      return await interaction.editReply(pages[page]);
    }
  },
};
