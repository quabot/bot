import type { ButtonArgs, CommandArgs, ContextArgs, ModalArgs, WsEventArgs } from '@typings/functionArgs';
import {
  Client as BaseClient,
  type ContextMenuCommandBuilder,
  type ClientOptions,
  type Collection,
  type SlashCommandBuilder,
} from 'discord.js';
import NodeCache from 'node-cache';

export interface Button {
  name: string;
  execute: (arg0: ButtonArgs) => any;
}

export interface Command {
  data: SlashCommandBuilder;
  execute: (arg0: CommandArgs) => any;
}

export interface Context {
  data: ContextMenuCommandBuilder;
  execute: (argo0: ContextArgs) => any;
}

export interface Modal {
  name: string;
  execute: (arg0: ModalArgs) => any;
}

export interface WsEvent {
  code: string;
  execute: (arg0: WsEventArgs) => any;
}

export interface Subcommand {
  parent: string;
  name: string;
  execute: (arg0: CommandArgs) => any;
}

export interface Client {
  cache: NodeCache;
  buttons: Collection<string, { name: string; execute: (arg0: ButtonArgs) => any }>;
  commands: Collection<string, { data: SlashCommandBuilder; execute: (arg0: CommandArgs) => any }>;
  contexts: Collection<string, { data: ContextMenuCommandBuilder; execute: (argo0: ContextArgs) => any }>;
  menus: Collection<string, any>;
  modals: Collection<string, { name: string; execute: (arg0: ModalArgs) => any }>;
  ws_events: Collection<string, { code: string; execute: (arg0: WsEventArgs) => any }>;
  subcommands: Collection<string, { parent: string; name: string; execute: (arg0: CommandArgs) => any }>;
  custom_commands: undefined[];
}

export class Client extends BaseClient {
  constructor(options: ClientOptions) {
    super(options);
  }
}
