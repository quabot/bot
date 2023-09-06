import { Client } from '@classes/discord';
import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  ColorResolvable,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export interface BaseArgs {
  client: Client;
}

export interface BaseInteractinoArgs extends BaseArgs {
  color: ColorResolvable;
}

export interface CommandArgs extends BaseInteractinoArgs {
  interaction: ChatInputCommandInteraction;
}

export interface ButtonArgs extends BaseInteractinoArgs {
  interaction: ButtonInteraction;
}

export interface ContextArgs extends BaseInteractinoArgs {
  interaction: UserContextMenuCommandInteraction;
}

export interface ModalArgs extends BaseInteractinoArgs {
  interaction: ModalSubmitInteraction;
}

export interface WsEventArgs extends BaseInteractinoArgs {
  data: any;
}
