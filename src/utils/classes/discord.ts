import type { Button, Command, MessageContext, Modal, Subcommand, UserContext, WsEvent } from 'utils/typings/structures';
import { Client as BaseClient, type ClientOptions, type Collection } from 'discord.js';
import NodeCache from 'node-cache';

export interface Client {
  cache: NodeCache;
  buttons: Collection<string, Button>;
  commands: Collection<string, Command>;
  userContexts: Collection<string, UserContext>;
  messageContexts: Collection<string, MessageContext>;
  menus: Collection<string, any>;
  modals: Collection<string, Modal>;
  ws_events: Collection<string, WsEvent>;
  subcommands: Collection<string, Subcommand>;
}

export class Client extends BaseClient {
  constructor(options: ClientOptions) {
    super(options);
  }
}
