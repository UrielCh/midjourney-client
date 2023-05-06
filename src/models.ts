import type { APIApplicationCommand, APIMessageReference, APIUser, Snowflake } from "../deps.ts";
import { ApplicationCommandType } from "../deps.ts";

export type InteractionName = "variations" | "grid" | "upscale" | "describe" | "imagine";

export interface Command extends APIApplicationCommand {
  name: "imagine" | "settings" | string;
  contexts?: unknown;
  // options?: CommandOpt[]
}

export interface Payload extends APIMessageReference {
  type: ApplicationCommandType;
  application_id: string;
  session_id: string;
  message_flags?: number;
  data: {
    version?: Snowflake;
    id?: Snowflake;
    name?: string;
    component_type?: number;
    custom_id?: string;
    type?: 1;
    options?: unknown[];
    application_command?: Command;
    attachments?: unknown[];
  };
  nonce?: string;
}

export interface UserReference extends APIUser {
  global_name: string | null;
  display_name: string | null;
  avatar_decoration: null;
  public_flags?: number; // bitmask of flags UserFlags
}

// export interface Comment {
//     type: 1,
//     components: { type: number, style: number, label?: string, emoji?: { name: string }, custom_id?: string, url?: string }[];
// }

// export interface DiscordMessage extends APIMessage {
//   author: UserReference;
//   content: string; //  "**Hall of a magnificent baroque palace filled with golden statues of skulls and paintings of skulls, beautiful staircase, Renaissance paintings, marble columns, high plants, large windows --ar 16:9 --s 1000 --v 5** - Image #3 <@1034011092203304968>",
//   mentions: UserReference[]; // extention from APIUser
//   flags?: number; // set of MessageFlags
//   referenced_message?: DiscordMessage; // Exclude<DiscordMessage, "message_reference" | "referenced_message">;
// }
