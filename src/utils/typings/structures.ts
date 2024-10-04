import type {
  ButtonArgs,
  CommandArgs,
  EventArgs,
  ModalArgs,
  WsEventArgs,
  MenuArgs,
  UserContextArgs,
  MessageContextArgs,
} from '@typings/functionArgs';
import { type ContextMenuCommandBuilder, type SlashCommandBuilder } from 'discord.js';

export interface Button {
  name: string;
  execute: (arg0: ButtonArgs) => Promise<any>;
}

export interface Menu {
  name: string;
  execute: (arg0: MenuArgs) => Promise<any>;
}

export interface Command {
  data: SlashCommandBuilder;
  execute: (arg0: CommandArgs) => Promise<any>;
}

export interface UserContext {
  data: ContextMenuCommandBuilder;
  execute: (argo0: UserContextArgs) => Promise<any>;
}
export interface MessageContext {
  data: ContextMenuCommandBuilder;
  execute: (argo0: MessageContextArgs) => Promise<any>;
}

export interface Modal {
  name: string;
  execute: (arg0: ModalArgs) => Promise<any>;
}

export interface WsEvent {
  code: string;
  execute: (arg0: WsEventArgs) => Promise<any>;
}

export interface Subcommand {
  parent: string;
  name: string;
  execute: (arg0: CommandArgs) => Promise<any>;
}

export interface Event {
  event: string;
  once: boolean;
  execute: (arg0: EventArgs, ...lastArgs: any[]) => Promise<any>;
}
