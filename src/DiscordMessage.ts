//TYPES IMPORTS
import { APIMessageInteraction } from "https://deno.land/x/discord_api_types@0.37.40/v9.ts";
import type {
  APIActionRowComponent,
  APIAttachment,
  APIButtonComponentWithCustomId,
  APIChannel,
  APIEmbed,
  APIMessage,
  APIMessageActionRowComponent,
  APIRole,
  Snowflake,
} from "../deps.ts";
// CODE imports
import { ButtonStyle, logger, MessageType, path, pc } from "../deps.ts";

import Midjourney from "./Midjourney.ts";
import type { InteractionName, UserReference } from "./models.ts";
import { download, REROLL } from "./utils.ts";

export interface ComponentsSummary {
  parentId: Snowflake;
  processed: boolean;
  label: string;
  custom_id: string;
}

export interface SplitedPrompt {
  source: string;
  prompt: string;
  id?: string;
  mode?: "fast" | "relaxed";
  name: string;
  completion?: number; // 0..1
}

export function extractPrompt(content: string): SplitedPrompt | undefined {
  if (!content) {
    return undefined;
  }

  const result: SplitedPrompt = {
    // id?: string;
    // mode?: "fast" | "relaxed";
    // completion?: number; // 0..1
    // completion: -1,
    source: "",
    prompt: "",
    name: "",
  };

  let extra = content;

  /**
   * speed first
   */

  if (extra.endsWith(" (fast)")) {
    result.mode = "fast";
    extra = extra.substring(0, extra.length - 7);
  } else if (extra.endsWith(" (relaxed)")) {
    result.mode = "relaxed";
    extra = extra.substring(0, extra.length - 10);
  }

  /**
   * progression
   */

  if (extra.endsWith(" (paused)")) {
    extra = extra.substring(0, extra.length - 9);
    result.completion = -1;
  } else if (extra.endsWith(" (Open on website for full quality)")) {
    extra = extra.substring(0, extra.length - 35);
    result.completion = 1;
  } else if (extra.endsWith(" (Waiting to start)")) {
    extra = extra.substring(0, extra.length - 19);
    result.completion = -1;
  } else {
    const extractPercent = extra.match(/ \(([0-9]+)%\)$/);
    if (extractPercent) {
      extra = extra.substring(0, extra.length - extractPercent[0].length);
      result.completion = parseInt(extractPercent[1]) / 100;
    }
  }

  /**
   * prefix
   */

  if (extra.startsWith("Making variations for image #")) {
    const prefix = extra.match(
      /^Making variations for image #(\d) with prompt /,
    );
    if (prefix) {
      result.name = prefix[1];
      extra = extra.substring(prefix[0].length);
    }
  }

  const extractId = extra.match(/ <@(\d+)>$/);
  if (extractId) {
    extra = extra.substring(0, extra.length - extractId[0].length);
    result.id = extractId[1];
  }
  // can be present befor the <@id>
  if (extra.endsWith(" Upscaled by")) {
    extra = extra.substring(0, extra.length - 12);
    if (result.completion === undefined) {
      result.completion = 1; // Upscaled are only display at completion
    }
  } else if (extra.endsWith(" Variations by")) {
    extra = extra.substring(0, extra.length - 14);
    if (result.completion === undefined) {
      result.completion = 1; // Variations are only display at completion
    }
  } else if (extra.endsWith("** -")) {
    if (result.completion === undefined) {
      result.completion = 1; // imagen on blend
    }
  }

  {
    const tailImage = extra.match(/ Image #(\d)$/);
    if (tailImage) {
      extra = extra.substring(0, extra.length - tailImage[0].length);
      result.source = tailImage[0];
    }
  }

  if (extra.endsWith("** -")) {
    extra = extra.substring(0, extra.length - 2);
  }

  if (extra.startsWith("**") && extra.endsWith("**") && extra.length > 4) {
    result.prompt = extra.substring(2, extra.length - 2);
    return result;
  }

  logger.warn("Failed to extract prompt data from:", pc.yellow(content));
  logger.warn(`Extra data:"${pc.yellow(extra)}"`);

  // if (content.startsWith("Making variations for image #")) {
  //   const m = content.match(
  //     /^Making variations for image #(\d) with prompt \*\*(.+)\*\* - <@(\d+)> \(Waiting to start\)$/,
  //   );
  //   if (!m) {
  //     logger.warn("Failed to extract prompt data from:", content);
  //     return undefined;
  //   }
  //   const prompt: SplitedPrompt = {
  //     prompt: m[2],
  //     source: content,
  //     name: `Image #${m[1]}`,
  //     id: m[3],
  //     completion: -1,
  //   };
  //   return prompt;
  // }
  //
  // let m = content.match(/^\*\*(.+)\*\* - (.+)$/); // (.+) <@(\d+)>
  // if (!m) {
  //   logger.warn("Failed to extract prompt data from:", content);
  //   return undefined;
  // }
  //
  // const prompt: SplitedPrompt = {
  //   prompt: m[1],
  //   source: content,
  //   name: "",
  // };
  // extra = m[2];
  // if (extra.endsWith(" (fast)")) {
  //   prompt.mode = "fast";
  //   extra = extra.substring(0, extra.length - 7);
  // } else if (extra.endsWith(" (relaxed)")) {
  //   prompt.mode = "relaxed";
  //   extra = extra.substring(0, extra.length - 10);
  // }
  //
  //
  // m = extra.match(/^<@(\d+)>$/);
  // if (m) {
  //   prompt.id = m[1];
  //   // prompt.type = "grid";
  //   return prompt;
  // }
  //
  // m = extra.match(/^Variations by <@(\d+)>$/);
  // if (m) {
  //   prompt.id = m[1];
  //   prompt.completion = 1;
  //   // prompt.type = "variations";
  //   return prompt;
  // }
  //
  // m = extra.match(/^Upscaled by <@(\d+)>$/);
  // if (m) {
  //   prompt.id = m[1];
  //   prompt.completion = 1;
  //   // prompt.type = "upscale";
  //   return prompt;
  // }
  //
  // m = extra.match(
  //   /^Variations by <@(\d+)>$/,
  // );
  // if (m) {
  //   prompt.id = m[1];
  //   // prompt.type = "variations";
  //   return prompt;
  // }

  // m = extra.match(/^Image #(\d) <@(\d+)>$/);
  // if (m) {
  //   prompt.id = m[2];
  //   prompt.completion = 1;
  //   // prompt.type = "upscale"; // or variations
  //   prompt.name = `Image #${m[1]}`;
  //   return prompt;
  // }
  //
  // m = extra.match(/^<@(\d+)> \((\d+)%\)$/);
  // if (m) {
  //   prompt.id = m[1];
  //   prompt.completion = parseInt(m[2]) / 100;
  //   // prompt.type = "grid";
  //   return prompt;
  // }
  //
  // m = extra.match(/^<@(\d+)> \(Waiting to start\)$/);
  // if (m) {
  //   prompt.id = m[1];
  //   prompt.completion = -1;
  //   // prompt.type = "grid";
  //   return prompt;
  // }
  // m = extra.match(/^<@(\d+)>$/);
  // if (m) {
  //   prompt.id = m[1];
  //   prompt.completion = 1;
  //   // prompt.type = "grid";
  //   return prompt;
  // }
  //
  // if (!extra.length) {
  //   return prompt;
  // }
  // logger.warn("Failed to extract prompt data from:", pc.yellow(content));

  // // dual () is note, mode
  // m = content.match(/^\*\*(.+)\*\* - <@(\d+)> \(([^)])\) \(([^)])\)$/);
  // if (m)
  //     return { prompt: m[1], name: "", id: m[2], note: m[3], mode: m[4] };
  // // single () is mode
  // m = content.match(/^\*\*(.+)\*\* - <@(\d+)> \(([^)]+)\)$/);
  // if (m)
  //     return { prompt: m[1], name: "", id: m[2], note: "", mode: m[3] };
  // return prompt;
}

export class DiscordMessage implements APIMessage {
  /**
   * ID of the message
   */
  id!: Snowflake;
  /**
   * ID of the channel the message was sent in
   */
  channel_id!: Snowflake;
  /**
   * The author of this message (only a valid user in the case where the message is generated by a user or bot user)
   *
   * If the message is generated by a webhook, the author object corresponds to the webhook's id,
   * username, and avatar. You can tell if a message is generated by a webhook by checking for the `webhook_id` property
   *
   * See https://discord.com/developers/docs/resources/user#user-object
   */
  author!: UserReference;
  /**
   * Contents of the message
   *
   * The `MESSAGE_CONTENT` privileged gateway intent will become required after **August 31, 2022** for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot > Privileged Gateway Intents**
   *
   * See https://support-dev.discord.com/hc/articles/4404772028055
   */
  content: string;
  /**
   * When this message was sent
   */
  timestamp!: string;
  /**
   * When this message was edited (or null if never)
   */
  edited_timestamp!: string | null;
  /**
   * Whether this was a TTS message
   */
  tts!: boolean;
  /**
   * Whether this message mentions everyone
   */
  mention_everyone!: boolean;
  /**
   * Users specifically mentioned in the message
   *
   * The `member` field is only present in `MESSAGE_CREATE` and `MESSAGE_UPDATE` events
   * from text-based guild channels
   *
   * See https://discord.com/developers/docs/resources/user#user-object
   * See https://discord.com/developers/docs/resources/guild#guild-member-object
   */
  mentions!: UserReference[]; // extention from APIUser
  /**
   * Roles specifically mentioned in this message
   *
   * See https://discord.com/developers/docs/topics/permissions#role-object
   */
  mention_roles!: APIRole["id"][];

  /**
   * Any attached files
   *
   * See https://discord.com/developers/docs/resources/channel#attachment-object
   *
   * The `MESSAGE_CONTENT` privileged gateway intent will become required after **August 31, 2022** for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot > Privileged Gateway Intents**
   *
   * See https://support-dev.discord.com/hc/articles/4404772028055
   */
  attachments!: APIAttachment[];

  /**
   * Any embedded content
   *
   * See https://discord.com/developers/docs/resources/channel#embed-object
   *
   * The `MESSAGE_CONTENT` privileged gateway intent will become required after **August 31, 2022** for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot > Privileged Gateway Intents**
   *
   * See https://support-dev.discord.com/hc/articles/4404772028055
   */
  embeds!: APIEmbed[];
  /**
   * Whether this message is pinned
   */
  pinned!: boolean;
  /**
   * Type of message
   *
   * See https://discord.com/developers/docs/resources/channel#message-object-message-types
   */
  type!: MessageType;
  /**
   * Message flags combined as a bitfield
   *
   * See https://discord.com/developers/docs/resources/channel#message-object-message-flags
   *
   * See https://en.wikipedia.org/wiki/Bit_field
   */
  flags?: number; //MessageFlags;
  /**
   * Sent if the message is a response to an Interaction
   */
  interaction?: APIMessageInteraction;
  /**
   * Sent if a thread was started from this message
   */
  thread?: APIChannel;

  /**
   * Sent if the message contains components like buttons, action rows, or other interactive components
   *
   * The `MESSAGE_CONTENT` privileged gateway intent will become required after **August 31, 2022** for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot > Privileged Gateway Intents**
   *
   * See https://support-dev.discord.com/hc/articles/4404772028055
   */
  components?: APIActionRowComponent<APIMessageActionRowComponent>[];

  /**
   * The message associated with the `message_reference`
   *
   * This field is only returned for messages with a `type` of `19` (REPLY).
   *
   * If the message is a reply but the `referenced_message` field is not present,
   * the backend did not attempt to fetch the message that was being replied to,
   * so its state is unknown.
   *
   * If the field exists but is `null`, the referenced message was deleted
   *
   * See https://discord.com/developers/docs/resources/channel#message-object
   */
  public referenced_message?: DiscordMessage | null;

  public prompt?: SplitedPrompt;

  /**
   * parent client
   */
  #client: Midjourney;

  constructor(client: Midjourney, source: APIMessage) {
    Object.assign(this, source);
    this.#client = client;
    // this.id = source.id;
    this.prompt = extractPrompt(source.content);
    this.content = source.content;
    if (source.referenced_message) {
      this.referenced_message = new DiscordMessage(
        client,
        source.referenced_message,
      );
    }
    // labels: '1️⃣2️⃣3️⃣4️⃣🔄'
    // const labels = this.components.map(a => a.label).join('');
    // const custom_ids = this.components.map((a) => a.custom_id).join("");
    if (source.interaction) {
      const name = source.interaction.name;
      if (name === "describe") {
        if (source.embeds && source.embeds[0]) {
          const embeds: APIEmbed = source.embeds[0];
          if (embeds.image) {
            const description: string = embeds.description || "";
            this.prompt = {
              source: description,
              name: embeds.image.url.replace(/.+\//, ""),
              prompt: description,
              completion: 1,
            };
          }
        } else {
          // embeds not available yet.
          this.prompt = {
            source: "",
            name: "",
            prompt: "",
            completion: -1,
          };
        }
      } else if (name === "imagine") {
        // empty
      } else if (name === "blend") {
        // empty
      } else {
        logger.info("interaction Name: ", name, this.prompt);
        // console.log("interaction source.embeds: ", source.embeds);
      }
    }
    //if (custom_ids.includes("MJ::Job::PicReader::")) {
  }

  get parentInteraction(): InteractionName | "" {
    if (this.interaction && this.interaction.name) {
      return this.interaction.name as InteractionName;
    }
    if (this.components && this.components.length) {
      const sig1 = this.components[0].components.map((a) => (a as { label: string }).label).join("");
      if (sig1.includes("U1U2U3U4")) {
        if (this.referenced_message && this.referenced_message.parentInteraction === "imagine") {
          return "variations";
        }
        return "imagine";
      }
      if (sig1.includes("Make VariationsWeb")) {
        return "upscale";
      }
      if (sig1.includes("Cancel Job")) {
        console.error("parsing Cancel Job:", this.content);
        return "";
        //return "imagine";
      }
      console.error("FIXME: can not Identify signature", sig1);
    }
    return "";
  }

  public getComponents(label: string, label2?: string): APIButtonComponentWithCustomId {
    if (!this.components) {
      throw Error("no components In this message.");
    }
    const availableLabels: string[] = [];
    for (const src of this.components) {
      for (const c of src.components) {
        if (!("custom_id" in c)) continue;
        if ("label" in c && c.label && c.label) {
          if (c.label === label) return c as APIButtonComponentWithCustomId;
          if (label2 && c.label === label2) return c as APIButtonComponentWithCustomId;
          availableLabels.push(c.label);
        } else if ("emoji" in c && c.emoji && c.emoji.name) {
          if (c.emoji.name === label) {
            return c as APIButtonComponentWithCustomId;
          }
          if (label2 && c.emoji.name === label2) {
            return c as APIButtonComponentWithCustomId;
          }
          availableLabels.push(`${c.emoji.name}`);
        }
      }
    }
    throw Error(
      `Failed to find componant named "${label}" within ${availableLabels.map((a) => `"${a}"`).join(", ")}`,
    );
  }

  /**
   * return if the the Message is upscalable, if an id is provide, will return true only if the requested action had not already been started.
   */
  canReroll(): APIButtonComponentWithCustomId | null {
    try {
      return this.getComponents(REROLL);
    } catch (_) {
      return null;
    }
  }

  /**
   * return if the the Message is upscalable, if an id is provide, will return true only if the requested action had not already been started.
   */
  canUpscale(id?: number): APIButtonComponentWithCustomId | null {
    const selector = id ? `U${id}` : "U1";
    try {
      const c = this.getComponents(selector);
      if (id) {
        if (!c.disabled && c.style !== ButtonStyle.Primary) { // 1 is primary button means that it had already been click
          return c;
        }
        return null;
      }
      return c;
    } catch (_) {
      if (id && (id > 4 || id < 0)) {
        logger.warn(`You asked for a image id out of bound [1,2,3,4]`);
      }
      return null;
    }
  }

  /**
   * return if the the Message can be varaint, if an id is provide, will return true only if the requested action had not already been started.
   */
  canVariant(id?: number): APIButtonComponentWithCustomId | null {
    const selector = id ? `V${id}` : "V1";
    try {
      const c = this.getComponents(selector, "Make Variations");
      if (id) {
        if (!c.disabled && c.style !== ButtonStyle.Primary) {
          return c;
        }
        return null; // 1 is primary button means that it had already been click
      }
      return c;
    } catch (_) {
      if (id && (id > 4 || id < 0)) {
        logger.warn(`You asked for a image id out of bound [1,2,3,4]`);
      }
      return null;
    }
  }

  reroll(progress?: (percent: number) => void): Promise<DiscordMessage> {
    const comp = this.getComponents(REROLL);
    logger.info(`${comp.custom_id} Reroll will be generated`);
    return this.#client.callCustomComponents(this.id, comp, progress);
  }

  upscale(id: number, progress?: (percent: number) => void): Promise<DiscordMessage> {
    const comp = this.getComponents(`U${id}`);
    logger.info(`${comp.custom_id} Upscale will be generated`);
    return this.#client.callCustomComponents(this.id, comp, progress);
  }

  variant(id: number, progress?: (percent: number) => void): Promise<DiscordMessage> {
    const comp = this.getComponents(`V${id}`, "Make Variations");
    logger.info(`${comp.custom_id} Variant will be generated`);
    return this.#client.callCustomComponents(this.id, comp, progress);
  }

  async refresh(): Promise<this> {
    const m2 = await this.#client.getMessageById(this.id);
    if (m2) {
      Object.assign(this, m2);
    }
    return this;
  }

  // async waitForattachements(timeout = 10): Promise<void> {
  //   for (let i = 0; i < timeout; i++) {
  //     if (!this.attachments || !this.attachments.length) {
  //       await wait(600);
  //       await this.refresh();
  //       console.log("Failed to get Attachement.");
  //     } else {
  //       break;
  //     }
  //   }
  // }

  async download(attachementId: number, dest: string): Promise<boolean> {
    // await this.waitForattachements();
    const att = (this.attachments || [])[attachementId];
    if (!att) {
      return false;
    }
    try {
      const stats = await Deno.stat(dest);
      if (stats.isDirectory) {
        const destFile = path.join(dest, att.filename);
        logger.info(`downloading ${att.url} to ${destFile}`);
        await download(att.url, destFile);
        return true;
      }
      throw Error(`download abort, ${dest} is an existing file`);
    } catch (_) {
      if (path.basename(dest).includes(".")) {
        await download(att.url, dest);
      } else {
        await Deno.mkdir(dest, { recursive: true });
        return this.download(attachementId, dest);
      }
    }
    return true;
  }
  // getComponents(processed: boolean, name?: string): ComponentsSummary[] {
  //   let list = this.componentsSummery.filter((a) => a.processed === processed);
  //   if (name) {
  //     list = list.filter((a) => a.label.startsWith(name));
  //   }
  //   return list;
  // }
}
