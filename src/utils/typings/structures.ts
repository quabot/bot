import type {
  ButtonArgs,
  CommandArgs,
  ContextArgs,
  EventArgs,
  ModalArgs,
  WsEventArgs,
  MenuArgs,
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

export interface Context {
  data: ContextMenuCommandBuilder;
  execute: (argo0: ContextArgs) => Promise<any>;
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
  name: string;
  once: boolean;
  execute: (arg0: EventArgs, ...lastArgs: any[]) => Promise<any>;
}
