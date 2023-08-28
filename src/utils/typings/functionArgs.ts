import type { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';

export interface CommandArgs {
  client: Client;
  interaction: ChatInputCommandInteraction;
  color: ColorResolvable;
}