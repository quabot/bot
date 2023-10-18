import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

//* Create the buttons for the about command.
const aboutComponents = [
  new ButtonBuilder().setCustomId('previous-about').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
  new ButtonBuilder().setCustomId('next-about').setStyle(ButtonStyle.Secondary).setEmoji('▶️'),
];

const aboutButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('previous-about').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
  new ButtonBuilder().setCustomId('next-about').setStyle(ButtonStyle.Secondary).setEmoji('▶️'),
);

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('View some information about QuaBot.')
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Create clientUser variable. Now we don't have to do `client.user!` everytime
    const clientUser = client.user!;

    //* Create the different embeds for the about system.
    const embed1 = new Embed(color)
      .setAuthor({
        name: `QuaBot v${require('../../../package.json').version}`,
        iconURL: `${clientUser.avatarURL({ forceStatic: false })}`,
      })
      .setThumbnail(`${clientUser.avatarURL({ forceStatic: false })}`)
      .setFooter({ text: 'Created by @joa_sss' })
      .setDescription(`Welcome to information center for **<:QLogo:1009229825908674570> [QuaBot](https://quabot.net)**! Here you can find loads of info about QuaBot and it's features. QuaBot uses slash commands, so the prefix to use it is \`/\`! We use interactions all throughout our commands and modules.
        
            QuaBot was designed and developed by [Joa_sss](https://joasss.xyz) and his [team](https://quabot.net/about/credits) and was written in Javascript with the [discord.js](https://discord.js.org) framework.
        
            It's very easy to get started with QuaBot, by simply typing a \`/\`! If you're still stuck somewhere, you can join our **[Support Server](https://discord.gg/HYGA7Y6ptk)** and ask for help there. To view all commands use \`/help\`. Go to the next page for more information.
        
            **[Website](https://quabot.net)** | **[Support](https://discord.gg/HYGA7Y6ptk)** | **[Invite](https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=995243562134409296)** | **[Dashboard](https://dashboard.quabot.net)**`);

    const embed2 = new Embed(color)
      .setAuthor({
        name: 'QuaBot | Dashboard',
        iconURL: `${clientUser.avatarURL({ forceStatic: false })}`,
      })
      .setThumbnail(`${clientUser.avatarURL({ forceStatic: false })}`)
      .setFooter({ text: 'Created by @joa_sss' })
      .setDescription(`In order to make it easier for the end-user to use QuaBot, we created an online dashboard. On our dashboard you can configure every setting to your liking.
        
            **What does it offer?**
            > - Command toggles: toggle and configure all of the commands that we offer.
            > - Module configuration: configure all of QuaBot's modules to the greatest extend.
            > - Server configuration: configure all of QuaBot's server settings.
            > - User Dashboard: server members can view their own QuaBot profile.
            All with responsive and intuitive UI and is very easy to use and understand.\n\nClick **[here](https://quabot.net/dashboard)** for our dashboard.`);

    const embed3 = new Embed(color)
      .setAuthor({
        name: 'QuaBot | Voting',
        iconURL: `${clientUser.avatarURL({ forceStatic: false })}`,
      })
      .setThumbnail(`${clientUser.avatarURL({ forceStatic: false })}`)
      .setFooter({ text: 'Created by @joa_sss' })
      .setDescription(`By voting for QuaBot you're helping us __a lot__.  When you vote with the links below you're getting us more users.
            \n**Why should you vote?**
            It helps us a lot! Show us support without paying money, and it takes just a few seconds. You also get the following benefits:\n- You get listed in the QuaBot support server.\n- You get a 1.5x level xp boost for 12 hours.
            \n\n**How can i vote?**
            - Go to the sites below.\n- Click the "Vote" button.\n- You will have to login.\n- It's as simple as that! Enjoy your perks. (Note: You only get the 1.5x level xp from Top.gg)
        
            \n\n**Vote Links:**
            🔗 **[Top.gg](https://top.gg/bot/995243562134409296)** | 🔗 **[Discordbotlist.com](https://discordbotlist.com/bots/quabot-2212)** | 🔗 **[Bots.gg](https://discord.bots.gg/bots/995243562134409296)**`);

    const embed4 = new Embed(color)
      .setAuthor({
        name: 'QuaBot | Terms of Service',
        iconURL: `${clientUser.avatarURL({ forceStatic: false })}`,
      })
      .setThumbnail(`${clientUser.avatarURL({ forceStatic: false })}`)
      .setFooter({ text: 'Created by @joa_sss' }).setDescription(`
            Our Terms of Service constitute a legally binding agreement made between you and QuaBot, concerning your access to and use of the bot. You agree that by utilizing the bot, you have read, understood, and agreed to be bound by all of our Terms of Service.
            > By using our bot you agree to those terms. If you do not agree with our Terms of Service then you are expressly prohibited from using the bot and you must discontinue use immediately.
            > Read our privacy policy, by using the bot, you agree to the collection and use of information in accordance with our Privacy Policy.
            
            **Where can i find these Terms of Service an Privacy Policy?**
            You can find the Terms of Service **[here](https://quabot.net/about/tos)** and the Privacy Policy **[here](https://quabot.net/about/privacy)**`);

    //* Put the embeds in a list and get the page system setup.
    const aboutEmbeds = [embed1, embed2, embed3, embed4];

    let page = 0;

    const currentPage = await interaction.editReply({
      embeds: [
        aboutEmbeds[page].setFooter({
          text: `Page ${page + 1} / ${aboutEmbeds.length}`,
        }),
      ],
      components: [aboutButtons],
    });

    //* Create the collector and update the pages accordingly.
    const collector = currentPage.createMessageComponentCollector({
      filter: i => i.customId === 'previous-about' || i.customId === 'next-about',
      time: 40000,
    });

    collector.on('collect', async i => {
      switch (i.customId) {
        case 'previous-about':
          page = page > 0 ? --page : aboutEmbeds.length - 1;
          break;
        case 'next-about':
          page = page + 1 < aboutEmbeds.length ? ++page : 0;
          break;
      }
      await i.deferUpdate();
      await i.editReply({
        embeds: [
          aboutEmbeds[page].setFooter({
            text: `Page ${page + 1} / ${aboutEmbeds.length}`,
          }),
        ],
        components: [aboutButtons],
      });
      collector.resetTimer();
    });

    //* Disable the buttons when the collector ends.
    collector.on('end', async (_, reason) => {
      if (reason !== 'messageDelete') {
        const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          aboutComponents[0].setDisabled(true),
          aboutComponents[1].setDisabled(true),
        );
        await currentPage
          .edit({
            embeds: [
              aboutEmbeds[page].setFooter({
                text: `Page ${page + 1} / ${aboutEmbeds.length}`,
              }),
            ],
            components: [disabledRow],
          })
          .catch(() => {});
      }
    });
  },
};
