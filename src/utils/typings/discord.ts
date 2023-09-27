import type { ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js';
import type { CommandArgs, ContextArgs } from '@typings/functionArgs';

export interface Command {
  data: SlashCommandBuilder;
  execute: (arg0: CommandArgs) => any;
}

export interface Context {
  data: ContextMenuCommandBuilder;
  execute: (argo0: ContextArgs) => any;
}
