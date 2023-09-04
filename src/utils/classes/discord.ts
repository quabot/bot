import type { ButtonArgs, CommandArgs, ContextArgs, ModalArgs } from '@typings/functionArgs';
import {
  Client as BaseClient,
  type ContextMenuCommandBuilder,
  type ClientOptions,
  type Collection,
  type SlashCommandBuilder,
} from 'discord.js';
import NodeCache from 'node-cache';

export interface Client {
  cache: NodeCache;
  buttons: Collection<string, { name: string; execute: (arg0: ButtonArgs) => any }>;
  commands: Collection<string, { data: SlashCommandBuilder; execute: (arg0: CommandArgs) => any }>;
  contexts: Collection<string, { data: ContextMenuCommandBuilder; execute: (argo0: ContextArgs) => any }>;
  menus: Collection<string, any>;
  modals: Collection<string, { name: string; execute: (arg0: ModalArgs) => any }>;
}

export class Client extends BaseClient {
  constructor(options: ClientOptions) {
    super(options);
  }
}
