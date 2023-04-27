import { type APIMessage, type APIMessageReference, type APIMessageActionRowComponent, type APIApplicationCommand, type APIUser } from "https://deno.land/x/discord_api_types@0.37.40/v9.ts";
// import { type Snowflake, type APIAttachment, type  APIButtonComponentWithCustomId, type APIActionRowComponent}  from "https://deno.land/x/discord_api_types@0.37.40/v9.ts";
import type { Snowflake, APIAttachment, APIButtonComponentWithCustomId, APIActionRowComponent, APIButtonComponentWithURL } from "https://deno.land/x/discord_api_types@0.37.40/v9.ts";
export type { Snowflake } from "https://deno.land/x/discord_api_types@0.37.40/v9.ts";


// export interface CommandOpt {
//     type: 3,
//     name: string,
//     description: string,
//     required: boolean,
// }

export interface Command extends APIApplicationCommand {
    name: "imagine" | "settings" | string,
    contexts?: unknown,
    // options?: CommandOpt[]
}

export interface Payload extends APIMessageReference {
    type: 1 | 2 | 3 | 4;
    application_id: string,
    // message_id: Snowflake,
    // channel_id: Snowflake,
    // guild_id: Snowflake,
    session_id: string,
    message_flags?: number,
    data: {
        version?: Snowflake,
        id?: Snowflake,
        name?: string,
        component_type?: number,
        custom_id?: string,
        type?: 1,
        options?: unknown[],
        application_command?: Command,
        attachments?: unknown[],
    },
    nonce?: string,
}

export interface UserReference extends APIUser {
    global_name: string | null;
    display_name: string | null;
    avatar_decoration: null;
    public_flags?: number; // bitmask of flags UserFlags
}

export interface Comment {
    type: 1,
    components: { type: number, style: number, label?: string, emoji?: { name: string }, custom_id?: string, url?: string }[];
}

export interface DiscodMessage extends APIMessage {
    author: UserReference;
    content: string; //  "**Hall of a magnificent baroque palace filled with golden statues of skulls and paintings of skulls, beautiful staircase, Renaissance paintings, marble columns, high plants, large windows --ar 16:9 --s 1000 --v 5** - Image #3 <@1034011092203304968>",
    // attachments: Attachement[]; // APIUser
    mentions: UserReference[]; // extention from APIUser
    // pinned: boolean;
    // mention_everyone: boolean;
    // tts: boolean;
    // timestamp: string; // "2023-04-25T15:41:11.318000+00:00",
    // edited_timestamp: string | null;
    flags?: number; // set of MessageFlags
    // components: Comment[];
    // components?: APIActionRowComponent<APIMessageActionRowComponent>[];
    // message_reference?: { channel_id: string, guild_id: string, message_id: string },
    // referenced_message: DiscodMessage; // Exclude<DiscodMessage, "referenced_message" >;
    // referenced_message: Pick<DiscodMessage, "id" | "type" | "content" | "channel_id" | "author" | "attachments" | "embeds" | "mentions" | "mention_roles" | "pinned">; // Exclude<DiscodMessage, "referenced_message" >;
    referenced_message?: DiscodMessage; // Exclude<DiscodMessage, "message_reference" | "referenced_message">;
}

export class componentData {
    public processed: boolean;
    public label: string;
    public custom_id: string;
    public url: string;

    constructor(src: APIButtonComponentWithCustomId | APIButtonComponentWithURL) {
        this.processed = src.style === 1; // 1 is primary button means that it had already been click
        this.label = src.label || src.emoji?.name || "N/A";
        if ('custom_id' in src) {
            this.custom_id = src.custom_id || "";
            this.url = "";
        } else  {
            this.custom_id = "";
            this.url = src.url || "";
            if (this.url)
                this.processed = true;
        }
    }
}

function getDataFromComponents(srcs: APIActionRowComponent<APIMessageActionRowComponent>[]): componentData[] {
    const out: componentData[] = [];
    for (const src of srcs) {
        for (const c of src.components) {
            if ("custom_id" in c && ("label" in c || "emoji" in c)) {
                out.push(new componentData(c)); //  as APIButtonComponentWithCustomId
            } else if ("label" in c && "url" in c) {
                out.push(new componentData(c)); //  as APIButtonComponentWithURL
            } else {
                console.log(c);
            }
        }
    }
    return out;
}


export interface ComponentsSummary {
    processed: boolean;
    label: string;
    custom_id: string;
}

export class DiscodMessageHelper {
    // msg: DiscodMessage;
    public content?: string;
    public prompt?: { prompt: string; name: string; id: string; note?: string; mode?: string };

    public author: { id: Snowflake, username: string }
    public mentions: { id: Snowflake, username: string }[];

    public attachments: APIAttachment[];
    public components: ComponentsSummary[];
    public id: Snowflake;

    constructor(msg: DiscodMessage) {
        this.id = msg.id
        if (!this.prompt) {
            const m = msg.content.match(/^\*\*(.+)\*\* - (.+) <@(\d+)>$/);
            if (m)
                this.prompt = { prompt: m[1], name: m[2], id: m[3] };
        }
        if (!this.prompt) {
            const m = msg.content.match(/^\*\*(.+)\*\* - <@(\d+)> \((.+)\) \((.+)\)$/);
            if (m)
                this.prompt = { prompt: m[1], name: "", id: m[2], note: m[3], mode: m[4] };
        }
        if (!this.prompt) {
            this.content = msg.content;
        }
        this.author = { id: msg.author.id, username: msg.author.username };
        this.mentions = msg.mentions.map(u => ({ id: u.id, username: u.username }))
        this.attachments = msg.attachments;
        this.components = getDataFromComponents(msg.components || []);
    }

    isImagineResult(): boolean {
        if (!this.prompt)
            return false;
        if (!this.prompt.note)
            return false;
        return true;
    }

    isUpscaleResult(): boolean {
        if (!this.prompt)
            return false;
        if (!this.prompt.name) // name is empty when it is a prompt
            return false;
        return true;
    }

    getComponents(processed: boolean, name?: string): ComponentsSummary[] {
        let list = this.components.filter(a => a.processed === processed);
        if (name) {
            list = list.filter(a => a.label === name);
        }
        return list;
    }

}