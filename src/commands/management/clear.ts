import { SlashCommandBuilder, PermissionFlagsBits, type GuildTextBasedChannel } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear an amount of messages in a channel.')
    .addNumberOption(option =>
      option.setName('amount').setDescription('The amount of messages to clear.').setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute({ interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    //* Ephemeral to make it private.
    await interaction.deferReply({ ephemeral: true });

    //* Get the amount of messages to delete and set it if it is invalid.
    let amount = interaction.options.getNumber('amount', true);
    if (!amount)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid amount of messages to delete.')],
      });

    if (amount < 0) amount = 0;
    if (amount > 100) amount = 100;

    let error = false;

    //* Delete the messages, give an error if failed.
    await (interaction.channel as GuildTextBasedChannel).bulkDelete(amount, true).catch(async e => {
      if (e.code === 50013) {
        await interaction.editReply({
          embeds: [
            new Embed(color)
              .setDescription(
                'I need some more permissions to execute that command. I need the `MANAGE MESSAGES` or `ADMINISTRATOR` permissions for that.',
              )
              .setColor(color),
          ],
        });

        error = true;
      }
    });

    //* Confirm that it worked to the user, if there's no error.
    if (!error)
      await interaction.editReply({
        embeds: [new Embed(color).setDescription(`Deleted ${amount} messages.`)],
      });
  },
};
