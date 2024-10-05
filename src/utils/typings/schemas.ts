import { ColorResolvable } from "discord.js";
import { Types } from "mongoose";

export interface IServer {
  guildId: string;
  locale: string;
  color: ColorResolvable;
  footer: string;
  footer_icon: string;
  updatesChannel: string;
  disabledCommands?: string[] | Types.Array<string>;
}