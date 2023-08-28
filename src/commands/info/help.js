const {
  SlashCommandBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  Client,
  CommandInteraction,
} = require('discord.js');
const { Embed } = require('@constants/embed');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of QuaBot commands and their descriptions.')
    .addStringOption(option =>
      option
        .setName('module')
        .setDescription('The module to get the commands from.')
        .setRequired(false)
        .addChoices(
          { name: 'fun', value: 'fun' },
          { name: 'info', value: 'info' },
          { name: 'fun', value: 'misc' },
          { name: 'moderation', value: 'moderation' },
          { name: 'management', value: 'management' },
          { name: 'modules', value: 'modules' },
        ),
    )
    .setDMPermission(false),
  
  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Get the module and list the different categories.
    const module = interaction.options.getString('module');

    const embeds = [];

    const categories = [
      {
        path: 'fun',
        fullName: 'Fun Commands',
        description: 'Play games, get memes and much more.',
      },
      {
        path: 'info',
        fullName: 'Info Commands',
        description: "Get QuaBot's ping, the membercount and much more.",
      },
      {
        path: 'management',
        fullName: 'Management Commands',
        description: 'Purge a channel, create a poll and so much more.',
      },
      {
        path: 'misc',
        fullName: 'Misc Commands',
        description: 'See an avatar, translate a text and so much more.',
      },
      {
        path: 'moderation',
        fullName: 'Moderation Commands',
        description: 'Ban a member, warn them and so much more.',
      },
      {
        path: 'modules',
        fullName: 'Module Commands',
        description: 'Create a ticket, leave a suggestion and so much more.',
      },
    ];

    // ? It works, never touch it again.
    categories.map(async c => {
      const list = (await PG(`${process.cwd().replace(/\\/g, '/')}/src/commands/${c.path}/*.js`))
        .map(file => {
          const item = require(file);
          return `**/${item.data.name}** - ${item.data.description}`;
        })
        .join('\n');

      const embed = new Embed(color).setTitle(c.fullName).setDescription(`${c.description}\n${list}`);
      embeds.push(embed);

      if (embeds.length === categories.length) {
        const helpComponents = [
          new ButtonBuilder().setCustomId('previous-help').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
          new ButtonBuilder().setCustomId('next-help').setStyle(ButtonStyle.Secondary).setEmoji('▶️'),
        ];

        const helpButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('previous-help').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
          new ButtonBuilder().setCustomId('next-help').setStyle(ButtonStyle.Secondary).setEmoji('▶️'),
        );

        let page = 0;
        if (module) page = categories.map(e => e.path).indexOf(module);

        const currentPage = await interaction
          .editReply({
            embeds: [
              embeds[page].setFooter({
                text: `Page ${page + 1} / ${embeds.length}`,
              }),
            ],
            components: [helpButtons],
            fetchReply: true,
          })
          .catch(() => {});

        const filter = i => i.customId === 'previous-help' || i.customId === 'next-help';

        const collector = await currentPage.createMessageComponentCollector({
          filter,
          time: 40000,
        });

        collector.on('collect', async i => {
          switch (i.customId) {
            case 'previous-help':
              page = page > 0 ? --page : embeds.length - 1;
              break;
            case 'next-help':
              page = page + 1 < embeds.length ? ++page : 0;
              break;
          }
          await i.deferUpdate();
          await i
            .editReply({
              embeds: [
                embeds[page].setFooter({
                  text: `Page ${page + 1} / ${embeds.length}`,
                }),
              ],
              components: [helpButtons],
            })
            .catch(e => {});
          collector.resetTimer();
        });

        collector.on('end', async (_, reason) => {
          if (reason !== 'messageDelete') {
            const disabledRow = new ActionRowBuilder().addComponents(
              helpComponents[0].setDisabled(true),
              helpComponents[1].setDisabled(true),
            );
            await currentPage.edit({
              embeds: [
                embeds[page].setFooter({
                  text: `Page ${page + 1} / ${embeds.length}`,
                }),
              ],
              components: [disabledRow],
            });
          }
        });
      }
    });
  },
};
