import type { Command } from "./models.ts";
import { logger, path } from "../deps.ts";
import { CommandsData } from "./CommandsData.ts";

export const KNOWN_METHODS = [
  "ask",
  "blend",
  "describe",
  "fast",
  "help",
  "imagine",
  "info",
  "invite",
  "prefer",
  "private",
  "public",
  "relax",
  "settings",
  "show",
  "stealth",
  "subscribe",
] as const;
export type KnownMethods = typeof KNOWN_METHODS[number];

/**
 * get command from Midjourney discord bot and cache it in memory and disk.
 */
export class CommandCache {
  cacheDirectory: string;
  cache: Partial<Record<KnownMethods, Command>> = {};

  constructor(private channel_id: string, private authorization: string) {
    this.cacheDirectory = "cmdCache";
  }

  // Old code
  async #fetchCommandOld(name: string): Promise<Command[]> {
    logger.info(
      `CommandCache: ${name} not in cache, requesting Discord server.`,
    );
    const url = `https://discord.com/api/v9/channels/${this.channel_id}/application-commands/search?type=1&query=${name}&limit=1&include_applications=false`;
    const response = await fetch(url, {
      headers: { authorization: this.authorization },
    });

    const data = (await response.json()) as {
      application_commands: Command[];
    };
    if ("application_commands" in data) {
      const application_commands = data.application_commands;
      return application_commands;
    }
    return [];
  }

  async #fetchCommand(name: string): Promise<Command[]> {
    logger.info(
      `CommandCache: ${name} not in cache, requesting Discord server.`,
    );
    const url = `https://discord.com/api/v9/channels/${this.channel_id}/application-command-index`;
    const response = await fetch(url, {
      headers: { authorization: this.authorization },
    });

    const data = (await response.json()) as {
      code?: number;
      message?: string;
      application_commands?: Command[];
    };
    if (data.application_commands) {
      const application_commands = data.application_commands;
      if (name) {
        const command = application_commands.filter((cmd) => cmd.name === name);
        if (!command.length) {
          logger.error(
            `CommandCache: ${name} not found, available cmds: ${application_commands.map((cmd) => cmd.name).join(", ")}`,
          );
        }
        return command;
      }
      return application_commands;
    }
    if (data.code && data.message) {
      logger.error(
        `fetchCommand from ${url} failed With error: ${data.message} code: ${data.code}`,
      );
    }
    return [];
  }

  async getCommand(name: KnownMethods): Promise<Command> {
    const fromCode = CommandsData.application_commands.find((cmd) => cmd.name === name);
    if (fromCode) {
      return fromCode as Command;
    }

    // try from memory cache
    if (this.cache[name]) {
      return this.cache[name] as Command;
    }
    let command: Command | undefined;
    // try from disk cache
    Deno.mkdirSync(this.cacheDirectory, { recursive: true });

    const cacheFile = this.getcacheFile(name);
    if (cacheFile) {
      try {
        command = JSON.parse(await Deno.readTextFile(cacheFile));
      } catch (_e) {
        // failed to load command from cache.
      }
    }
    // get from discord
    if (!command) {
      const application_commands = await this.#fetchCommand(name);
      if (application_commands[0]) {
        command = application_commands[0];
        if (cacheFile) {
          await Deno.writeTextFile(
            cacheFile,
            JSON.stringify(command, undefined, 2),
          );
        }
      }
    }
    // save in memory
    if (command) {
      this.cache[name] = command;
      return command;
    }
    throw Error(`Failed to get application_commands for command ${name}`);
  }

  getcacheFile(name: KnownMethods): string {
    if (!this.cacheDirectory) return "";
    return path.join(this.cacheDirectory, `${name}.json`);
  }
}
