import { Embed } from '@classes/embed';
import { getEconomyUser } from '@configs/economyUser';
import { cooldowns } from '@typings/economy';
import { CommandArgs } from '@typings/functionArgs';
import { Colors } from 'discord.js';
import moment from 'moment';

export default {
  parent: 'economy',
  name: 'gamble',
  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const amount = interaction.options.getInteger('amount', true);
    if (amount < 10)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You must gamble at least 10 coins.')],
      });

    if (amount > 10000)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot gamble more than 10.000 coins.')],
      });

    const user = await getEconomyUser(interaction.user.id);
    if (!user)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not currently in our system. Please run the command again.')],
      });

    //* Cooldown of 2 minutes
    if ((new Date().getTime() - user.cooldowns.gamble) < cooldowns.gamble)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `You must wait **${moment(user.cooldowns.gamble + cooldowns.gamble).fromNow()}** before gambling again.`,
          ),
        ],
      });

    if (user.walletCoins < amount)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'You do not have enough coins to gamble that amount. Maybe transfer some coins to your wallet, or try a lower amount.',
          ),
        ],
      });

    //* Bot roll should be biased, so the bot has a higher chance of winning (70%/30%)
    const userRoll = Math.floor(Math.random() * 100);
    let botRoll = Math.floor(Math.floor(Math.random() * 70) * (100 / 70));
    if (botRoll === userRoll) botRoll++;

    //! Todo: cooldown, general enabled/disable, boosts, achievements.

    if (userRoll > botRoll) {
      //* The amount of coins that the user won is based on the difference between the two.
      const wonPercentage = userRoll - botRoll;
      const wonCoins = Math.floor(amount * (wonPercentage / 100));
      user.walletCoins += wonCoins;
      await user.save();

      await interaction.editReply({
        embeds: [
          new Embed(Colors.Green)
            .setTitle('You won!')
            .setDescription(
              `You won **${wonCoins}** coins!\nYour received \`${wonPercentage}%\` of the coins you've gambled.\n\nYou now have **${user.walletCoins.toLocaleString()}** coins.`,
            )
            .addFields(
              { name: 'You rolled', value: `\`${userRoll}\``, inline: true },
              { name: 'I rolled', value: `\`${botRoll}\``, inline: true },
            ),
        ],
      });
    } else {
      user.walletCoins -= amount;
      await user.save();

      await interaction.editReply({
        embeds: [
          new Embed(Colors.Red)
            .setTitle('You lost!')
            .setDescription(
              `You lost **${amount}** coins!\n\nYou now have **${user.walletCoins.toLocaleString()}** coins.`,
            )
            .addFields(
              { name: 'You rolled', value: `\`${userRoll}\``, inline: true },
              { name: 'I rolled', value: `\`${botRoll}\``, inline: true },
            ),
        ],
      });
    }
  },
};
