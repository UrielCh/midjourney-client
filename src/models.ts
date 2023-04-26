import { type APIMessage, type APIMessageReference, type APIMessageActionRowComponent, type APIApplicationCommand, type APIUser } from "https://deno.land/x/discord_api_types@0.37.40/v9.ts";
import { type Snowflake }  from "https://deno.land/x/discord_api_types@0.37.40/v9.ts";

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
    // guild_id: string,
    session_id: string,
    message_flags?: number,
    data: {
        version?: Snowflake,
        id?: Snowflake,
        name?: string,
        component_type?: number,
        custom_id?: string,
        type?: 1,
        options?: any[],
        application_command?: Command,
        attachments?: any[],
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
    components: { type: number, style: number, label?: string, emoji?: { name: string}, custom_id?: string, url?: string }[];
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
    // flags: number;
    // components: Comment[];
    // components?: APIActionRowComponent<APIMessageActionRowComponent>[];
    // message_reference?: { channel_id: string, guild_id: string, message_id: string },
    // referenced_message: DiscodMessage; // Exclude<DiscodMessage, "referenced_message" >;
    // referenced_message: Pick<DiscodMessage, "id" | "type" | "content" | "channel_id" | "author" | "attachments" | "embeds" | "mentions" | "mention_roles" | "pinned">; // Exclude<DiscodMessage, "referenced_message" >;
    referenced_message?: DiscodMessage; // Exclude<DiscodMessage, "message_reference" | "referenced_message">;
}