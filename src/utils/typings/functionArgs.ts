import type { Client } from '@classes/discord';
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ColorResolvable,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export interface BaseArgs {
  client: Client;
  color: ColorResolvable;
}

export interface CommandArgs extends BaseArgs {
  interaction: ChatInputCommandInteraction;
}

export interface CommandExecutableFromButtonArgs extends BaseArgs {
  interaction: ChatInputCommandInteraction | ButtonInteraction;
}

export interface ButtonArgs extends BaseArgs {
  interaction: ButtonInteraction;
}

export interface MenuArgs extends BaseArgs {
  interaction: AnySelectMenuInteraction;
}

export interface UserContextArgs extends BaseArgs {
  interaction: UserContextMenuCommandInteraction;
}
export interface MessageContextArgs extends BaseArgs {
  interaction: MessageContextMenuCommandInteraction;
}

export interface ModalArgs extends BaseArgs {
  interaction: ModalSubmitInteraction;
}

export interface WsEventArgs {
  client: Client;
  data: any;
}

export interface EventArgs extends BaseArgs {}
