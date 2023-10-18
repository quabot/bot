import type { Button, Command, Context, Modal, Subcommand, WsEvent } from '@typings/structures';
import { Client as BaseClient, type ClientOptions, type Collection } from 'discord.js';
import NodeCache from 'node-cache';

export interface Client {
  cache: NodeCache;
  buttons: Collection<string, Button>;
  commands: Collection<string, Command>;
  contexts: Collection<string, Context>;
  menus: Collection<string, any>;
  modals: Collection<string, Modal>;
  ws_events: Collection<string, WsEvent>;
  subcommands: Collection<string, Subcommand>;
  //todo debug to be sure
  custom_commands: any[];
}

export class Client extends BaseClient {
  constructor(options: ClientOptions) {
    super(options);
  }
}
