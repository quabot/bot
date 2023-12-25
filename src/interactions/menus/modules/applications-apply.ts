import { Embed } from '@constants/embed';
import Application from '@schemas/Application';
import { MenuArgs } from '@typings/functionArgs';
import {
  ActionRowBuilder,
  type ActionRowData,
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  type JSONEncodable,
  type MessageActionRowComponentBuilder,
  type MessageActionRowComponentData,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type ModalSubmitInteraction,
  type StringSelectMenuInteraction,
} from 'discord.js';

export default {
  name: 'applications-apply',

  async execute({ interaction, color }: MenuArgs) {
    await interaction.deferReply({ ephemeral: true });

    const application = await Application.findOne({ guildId: interaction.guildId!, id: interaction.values[0] });
    if (!application) return;

    interface Page {
      embeds: Embed[];
      components: (
        | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
        | ActionRowData<MessageActionRowComponentData | MessageActionRowComponentBuilder>
        | APIActionRowComponent<APIMessageActionRowComponent>
      )[];
    }

    let pages: Page[] = application.questions!.map((question, i) => {
      const message: Page = {
        embeds: [
          new Embed(color)
            .setTitle(question.question)
            .setDescription(question.description ?? null)
            .setImage(question.image ?? null)
            .setThumbnail(question.thumbnail ?? null),
        ],
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

      switch (question.type) {
        case 'checkbox': {
          message.components?.push(
            new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
              new StringSelectMenuBuilder()
                .setMinValues(question.required ? 1 : 0)
                .setMaxValues(question.options!.length)
                .setOptions(
                  question
                    .options!.filter(option => option)
                    .map(value => {
                      return { label: value, value };
                    }),
                )
                .setCustomId(i.toString()),
            ),
          );

          break;
        }

        case 'bool': {
          message.components?.push(
            new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
              new StringSelectMenuBuilder()
                .setMinValues(question.required ? 1 : 0)
                .setOptions({ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' })
                .setCustomId(i.toString()),
            ),
          );

          break;
        }

        case 'multiple': {
          message.components?.push(
            new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
              new StringSelectMenuBuilder()
                .setMinValues(question.required ? 1 : 0)
                .setOptions(
                  question
                    .options!.filter(option => option)
                    .map(value => {
                      return { label: value, value };
                    }),
                )
                .setCustomId(i.toString()),
            ),
          );

          break;
        }

        default: {
          message.components?.push(
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder().setLabel('Answer').setStyle(ButtonStyle.Secondary).setCustomId(i.toString()),
            ),
          );
        }
      }

      return message;
    });

    pages.push({
      embeds: [
        new Embed(color)
          .setTitle('There are no more questions!')
          .setDescription(
            "If you click the green submit button below, the owner of this application will see your answers and you won't be able to change them!",
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

    pages = pages.map(p => {
      p.embeds[0].setAuthor({ name: application.name.slice(0, 256) });
      return p;
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

    answerCollector.on('collect', async inter => {
      const i = parseInt(inter.customId);

      if (inter.isButton()) {
        const question = application.questions![i];

        const customId = `${application.id}-${application.guildId}-${i}`;

        await inter.showModal(
          new ModalBuilder()
            .setTitle(application.name)
            .setCustomId(customId)
            .setComponents(
              new ActionRowBuilder<TextInputBuilder>().setComponents(
                new TextInputBuilder()
                  .setLabel(question.question)
                  .setPlaceholder(question.description ?? '')
                  .setStyle(question.type === 'paragraph' ? TextInputStyle.Paragraph : TextInputStyle.Short)
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
      answers: string[],
    ) {
      await interaction.deferReply({ ephemeral: true });

      pages[i].embeds[0].setFields({
        name: 'Answer',
        value: (answers.length > 1 ? '- ' : '') + answers.join('\n- '),
      });

      await updatePage();
      await interaction.deleteReply();
    }

    async function updatePage() {
      return await interaction.editReply(pages[page]);
    }
  },
};
