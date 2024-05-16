//TYPES IMPORTS
import type {
  APIActionRowComponent,
  APIAttachment,
  APIButtonComponentWithCustomId,
  APIChannel,
  APIEmbed,
  APIMessage,
  APIMessageActionRowComponent,
  APIMessageInteraction,
  APIRole,
  Snowflake,
} from "../deps.ts";
// CODE imports
import { ButtonStyle, logger, MessageType, path, pc } from "../deps.ts";

import Midjourney from "./Midjourney.ts";
import type { InteractionName, UserReference } from "./models.ts";
import { downloadFileCached, REROLL } from "./utils.ts";

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
  mode?: "turbo" | "fast" | "relaxed" | "fast, stealth" | "relaxed, stealth" | "turbo, stealth";
  name: string;
  completion?: number; // 0..1
}

const progressionQueue = -1;
const progressionStoped = -1;

export function extractPrompt(
  content: string,
  id: Snowflake,
): SplitedPrompt | undefined {
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
   * digest speed first from the end of the message
   */

  if (extra.endsWith(" (fast)")) {
    result.mode = "fast";
    extra = extra.substring(0, extra.length - 7);
  } else if (extra.endsWith(" (turbo)")) {
    result.mode = "turbo";
    extra = extra.substring(0, extra.length - 8);
  } else if (extra.endsWith(" (relaxed)")) {
    result.mode = "relaxed";
    extra = extra.substring(0, extra.length - 10);
  } else if (extra.endsWith(" (fast, stealth)")) {
    result.mode = "fast, stealth";
    extra = extra.substring(0, extra.length - 16);
  } else if (extra.endsWith(" (relaxed, stealth)")) {
    result.mode = "relaxed, stealth";
    extra = extra.substring(0, extra.length - 19);
  } else if (extra.endsWith(" (turbo, stealth)")) {
    result.mode = "turbo, stealth";
    extra = extra.substring(0, extra.length - 17);
  }

  /**
   * digest progression from the end of the message
   */

  if (extra.endsWith(" (paused)")) {
    extra = extra.substring(0, extra.length - 9);
    result.completion = progressionQueue;
  } else if (extra.endsWith(" (Stopped)")) {
    extra = extra.substring(0, extra.length - 10);
    result.completion = progressionStoped;
  } else if (extra.endsWith(" (Open on website for full quality)")) {
    extra = extra.substring(0, extra.length - 35);
    result.completion = 1;
  } else if (extra.endsWith(" (Waiting to start)")) {
    extra = extra.substring(0, extra.length - 19);
    result.completion = progressionQueue;
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

  if (extra.startsWith("Upscaling image #")) {
    const prefix = extra.match(
      /^Upscaling image #(\d) with /,
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
  } else if (extra.endsWith(" Variations (Strong) by")) {
    extra = extra.substring(0, extra.length - 23);
    if (result.completion === undefined) {
      result.completion = 1; // Variations are only display at completion
    }
  } else if (extra.endsWith(" Variations (Subtle) by")) {
    extra = extra.substring(0, extra.length - 23);
    if (result.completion === undefined) {
      result.completion = 1; // Variations are only display at completion
    }
  } else if (extra.endsWith(" Upscaled (Beta) by")) {
    extra = extra.substring(0, extra.length - 19);
    if (result.completion === undefined) {
      result.completion = 1; // Variations are only display at completion
    }
  } else if (extra.endsWith(" Upscaled (Max) by")) {
    extra = extra.substring(0, extra.length - 18);
    if (result.completion === undefined) {
      result.completion = 1; // Variations are only display at completion
    }
  } else if (extra.endsWith(" Upscaled (Subtle) by")) {
    extra = extra.substring(0, extra.length - 21);
    if (result.completion === undefined) {
      result.completion = 1; // Variations are only display at completion
    }
  } else if (extra.endsWith(" Upscaled (Light) by")) {
    extra = extra.substring(0, extra.length - 20);
    if (result.completion === undefined) {
      result.completion = 1; // Variations are only display at completion
    }
  } else if (extra.endsWith(" Zoom Out by")) {
    extra = extra.substring(0, extra.length - 12);
    if (result.completion === undefined) {
      result.completion = 1;
    }
  } else if (extra.endsWith(" Remix by")) {
    extra = extra.substring(0, extra.length - 9);
    if (result.completion === undefined) {
      result.completion = 1;
    }
  } else if (extra.endsWith(" Remix (Subtle) by")) {
    extra = extra.substring(0, extra.length - 18);
    if (result.completion === undefined) {
      result.completion = 1;
    }
  } else if (extra.endsWith(" Remaster by")) {
    extra = extra.substring(0, extra.length - 12);
    if (result.completion === undefined) {
      result.completion = 1;
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
      result.source = tailImage[0].trim();
      result.completion = 1; // upscall have no progress
    }
  }

  if (extra.endsWith("** -")) {
    extra = extra.substring(0, extra.length - 2);
  }

  if (extra.startsWith("**") && extra.endsWith("**") && extra.length > 4) {
    result.prompt = extra.substring(2, extra.length - 2);
    return result;
  }
  if (id === "936929561302675456") {
    logger.warn(`You may open an issue at https://github.com/UrielCh/midjourney-client/issues`);
    logger.warn(`TODO Add a new test case in "${pc.green("DiscordMessage_test.ts")}"

Deno.test(function ParseVariant${Date.now()}() {
  const p = "${pc.yellow(content)}";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.prompt, "The expected prompt");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, -1);
});

// Left over Extra data:"${pc.yellow(extra)}"\n`);
    // logger.warn(`Failed to extract prompt data from: ${pc.yellow(content)}`);
  }
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
    this.prompt = extractPrompt(source.content, source.author?.id);
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

  get componentsNames(): string[] {
    const out: string[] = [];
    if (!this.components) {
      return out;
    }
    for (const component of this.components) {
      const line = component.components
        .map((a) => (a as { label: string }).label)
        .filter((a) => a);
      out.push(...line);
    }
    return out;
  }

  get parentInteraction(): InteractionName | "" {
    if (this.interaction && this.interaction.name) {
      return this.interaction.name as InteractionName;
    }
    if (this.components && this.components.length) {
      const sig1 = this.componentsNames.join("");
      // [0].components.map((a) => (a as { label: string }).label).join("");
      if (sig1 === "U1V1" || sig1.includes("U1U2")) {
        // U3U4
        if (
          this.referenced_message &&
          this.referenced_message.parentInteraction === "imagine"
        ) {
          return "variations";
        }
        if (this.prompt) {
          // "<https://s.mj.run/abcd> <https://s.mj.run/abcd> --ar 2:3 --v 5.1"
          let prompt = this.prompt.prompt;
          prompt = prompt.replace(/ --s [0-9]+$/, "");
          prompt = prompt.replace(/ --(v|niji) [0-9.]+$/, "");
          prompt = prompt.replace(/ --ar [:0-9]+$/, "");
          const urls = prompt.split(" ");
          const u2 = urls
            .map((a) => !a.match(/<https:\/\/s\.mj\.run\/[\w\d]+>/))
            .filter((a) => a);
          if (u2.length === 0 && urls.length > 1) {
            return "blend";
          }
        }
        return "imagine";
      }
      // Make VariationsDetailed Upscale RedoBeta Upscale RedoRemasterWeb
      if (
        sig1.includes("Make VariationsWeb") ||
        sig1.includes("Make VariationsLight Upscale") ||
        sig1.includes("Make VariationsDetailed Upscale")
      ) {
        return "upscale";
      }
      // if (sig1 === 'Make VariationsRemasterWeb') {
      //   return "upscale";
      // }
      if (this.prompt && this.prompt.source.startsWith("Image #")) {
        return "upscale";
      }
      if (sig1.includes("Cancel Job")) {
        console.error("parsing Cancel Job:", this.content);
        return "";
        //return "imagine";
      }
      console.error(
        `FIXME: can not Identify signature ${
          pc.green(
            sig1,
          )
        } in message: ${pc.green(this.id)}`,
      );
    }
    return "";
  }

  public getComponents(
    label: string,
    label2?: string,
  ): APIButtonComponentWithCustomId {
    if (!this.components) {
      throw Error("no components In this message.");
    }
    const availableLabels: string[] = [];
    for (const src of this.components) {
      for (const c of src.components) {
        if (!("custom_id" in c)) continue;
        if ("label" in c && c.label && c.label) {
          if (c.label === label) return c as APIButtonComponentWithCustomId;
          if (label2 && c.label === label2) {
            return c as APIButtonComponentWithCustomId;
          }
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
      `Failed to find componant named "${label}" within ${
        availableLabels
          .map((a) => `"${a}"`)
          .join(", ")
      }`,
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
        if (!c.disabled && c.style !== ButtonStyle.Primary) {
          // 1 is primary button means that it had already been click
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

  upscale(
    id: number,
    progress?: (percent: number) => void,
  ): Promise<DiscordMessage> {
    const comp = this.getComponents(`U${id}`);
    logger.info(`${comp.custom_id} Upscale will be generated`);
    return this.#client.callCustomComponents(this.id, comp, progress);
  }

  variant(
    id: number,
    progress?: (percent: number) => void,
  ): Promise<DiscordMessage> {
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

  async download(
    attachementId: number,
    dest: string,
  ): Promise<{ data: ArrayBufferLike; file: string; cached: boolean } | null> {
    // await this.waitForattachements();
    const att = (this.attachments || [])[attachementId];
    if (!att) {
      return null;
    }
    try {
      const stats = await Deno.stat(dest);
      if (stats.isDirectory) {
        const destFile = path.join(dest, att.filename);
        logger.info(`downloading ${pc.green(att.url)} to ${pc.green(destFile)}`);
        return await downloadFileCached(att.url, destFile);
      }
      throw Error(`download abort, ${dest} is an existing file`);
    } catch (_) {
      if (path.basename(dest).includes(".")) {
        return await downloadFileCached(att.url, dest);
      } else {
        await Deno.mkdir(dest, { recursive: true });
        return this.download(attachementId, dest);
      }
    }
  }
  // getComponents(processed: boolean, name?: string): ComponentsSummary[] {
  //   let list = this.componentsSummery.filter((a) => a.processed === processed);
  //   if (name) {
  //     list = list.filter((a) => a.label.startsWith(name));
  //   }
  //   return list;
  // }
}
