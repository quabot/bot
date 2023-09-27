import type { Command, Context } from '@typings/discord';
import type { ButtonArgs, CommandArgs, ModalArgs, WsEventArgs } from '@typings/functionArgs';
import { Client as BaseClient, type ClientOptions, type Collection } from 'discord.js';
import NodeCache from 'node-cache';

export interface Client {
  cache: NodeCache;
  buttons: Collection<string, { name: string; execute: (arg0: ButtonArgs) => any }>;
  commands: Collection<string, Command>;
  contexts: Collection<string, Context>;
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
