import { Command } from "./models.ts";

export const KNOWN_METHODS = ["ask", "blend", "describe", "fast", "help", "imagine", "info", "invite", "prefer", "private", "public", "relax", "settings", "show", "stealth", "subscribe" ] as const;
export type KnownMethods = typeof KNOWN_METHODS[number];

export class CommandCache {
    cache: Partial<Record<KnownMethods, Command>> = {};

    constructor(private channel_id: string, private authorization: string) {
    }

    async getCommand(name: KnownMethods): Promise<Command> {
        if (this.cache[name])
            return this.cache[name] as Command;
        const url = `https://discord.com/api/v9/channels/${this.channel_id}/application-commands/search?type=1&query=${name}&limit=1&include_applications=false`;
        const response = await fetch(url, { headers: { authorization: this.authorization }});
        const data = await response.json();
        if ('application_commands' in data) {
            const { application_commands } = data;
            if (application_commands[0]) {
                this.cache[name] = application_commands[0] as Command;
                return application_commands[0] as Command;
            }
        }
        throw Error(`Failed to get application_commands for command ${name}`);
    }
}
