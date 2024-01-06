import { Embed } from '@constants/embed';
import Application from '@schemas/Application';
import ApplicationAnswer from '@schemas/ApplicationAnswer';
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
  Colors,
} from 'discord.js';
import uuid from 'uuid-wand';

export default {
  name: 'applications-apply',

  async execute({ interaction, color }: MenuArgs) {
    await interaction.deferReply({ ephemeral: true });

    const application = await Application.findOne({ guildId: interaction.guildId!, id: interaction.values[0] });
    if (!application)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("This application doesn't exist anymore.")],
      });

    if (!application.reapply) {
      const applicationAnswer = await ApplicationAnswer.findOne({
        guildId: interaction.guildId!,
        id: interaction.values[0],
        userId: interaction.user.id,
      });

      if (applicationAnswer)
        return await interaction.editReply({
          embeds: [
            new Embed(color).setDescription(
              "You've already applied for this application and re-applying is turned off for this application.",
            ),
          ],
        });
    }

    const applicationAnswers: (string | string[] | number[])[] = application.questions!.map(q =>
      q.type === 'short' || q.type === 'paragraph' ? '' : [],
    );

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
            .setThumbnail(question.thumbnail ?? null)
            .setFields({ name: 'Required?', value: question.required ? 'Yes' : 'No' }),
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
                    .map((value, i) => {
                      return { label: value, value: i.toString() };
                    }),
                )
                .setCustomId(i.toString())
                .setPlaceholder('Choose all options that apply'),
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
                .setCustomId(i.toString())
                .setPlaceholder('Yes/No'),
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
                .setCustomId(i.toString())
                .setPlaceholder('Choose an option'),
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
    const submitCollector = initMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: i => i.customId === 'submit',
      max: 1,
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

    submitCollector.once('collect', async inter => {
      const validated = applicationAnswers.map(
        (a, i) => !(a.length === 0 && application.questions![i].required === true),
      );
      if (validated.includes(false)) {
        await inter.reply({
          embeds: [
            new Embed(Colors.Red).setDescription(
              `You haven't filled out all of the required questions yet!\n Questions ${validated
                .map((v, i) => [v, i])
                .filter(v => v[0] === false)
                .map(v => `\`${(v[1] as number) + 1}\``)
                .join(', ')} haven't been answered yet!`,
            ),
          ],
          ephemeral: true,
        });

        return;
      }

      await new ApplicationAnswer({
        guildId: interaction.guildId!,
        userId: interaction.user.id,
        id: application.id,
        response_uuid: uuid.v4(),
        state: 'pending',
        time: new Date(),
        answers: applicationAnswers,
        reason: '',
      }).save();

      //todo sending staff msg

      await inter.update({
        embeds: [new Embed(color).setDescription('Your application is submitted.')],
        components: [],
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
      answers: string[],
    ) {
      const question = application!.questions![i];
      const { type } = question;
      const isCheckbox = type === 'checkbox';
      const processedAnswers = isCheckbox
        ? answers.map(a => parseInt(a))
        : type === 'paragraph' || type === 'short'
          ? answers[0]
          : answers;

      applicationAnswers[i] = processedAnswers;

      await interaction.deferReply({ ephemeral: true });

      pages[i].embeds[0].spliceFields(1, 1, {
        name: 'Answer',
        value: isCheckbox
          ? '- ' + (processedAnswers as number[]).map(a => question.options![a]).join('\n- ')
          : typeof processedAnswers === 'object'
            ? processedAnswers[0].toString()
            : processedAnswers,
      });

      await updatePage();
      await interaction.deleteReply();
    }

    async function updatePage() {
      return await interaction.editReply(pages[page]);
    }
  },
};
