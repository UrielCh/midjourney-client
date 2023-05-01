import { DiscordMessage } from "./DiscordMessage.ts";
import { SnowflakeObj } from "./SnowflakeObj.ts";
// import * as cmd from "./applicationCommand.ts";
import { CommandCache } from "./CommandCache.ts";
import type { Command, Payload, ResponseType } from "./models.ts";
import { APIButtonComponentWithCustomId, APIMessage, ApplicationCommandType, ButtonStyle } from "../deps.ts";
import type { RESTGetAPIChannelMessagesQuery, Snowflake } from "../deps.ts";
// import MsgsCache from "./MsgsCache.ts";
import { logger } from "../deps.ts";
import { download, filename2Mime, getExistinggroup, REROLL, wait } from "./utils.ts";

// import * as DiscordJs from "npm:discord.js";

const interactions = "https://discord.com/api/v9/interactions";

export type UploadSlot = {
  id: number;
  upload_filename: string;
  upload_url: string;
};

export interface WaitOptions {
  prompt?: string;
  name?: string;
  maxWait?: number;
  type?: ResponseType;
  imgId?: 1 | 2 | 3 | 4 | string;
  startId?: Snowflake;
  parentId?: Snowflake;
}

export class Midjourney {
  readonly auth: string;
  readonly application_id: string;
  readonly guild_id: string;
  readonly channel_id: string;
  readonly session_id: string;
  readonly commandCache: CommandCache;

  // readonly DISCORD_TOKEN: string;
  // readonly DISCORD_BOTID: string;
  // readonly cookie: string;
  //readonly x_super_properties: string;
  //readonly x_discord_locale: string;

  public MAX_TIME_OFFSET = 10 * 1000;

  /**
   * build a Midjourney client from a fetch request extracted from a discord browser message.
   * sample can be the fetch call test, or an existing filename, containing the fetch request.
   * @param sample
   */
  constructor(sample: string) {
    if (!sample.includes("{")) {
      // use sample as a filename
      sample = Deno.readTextFileSync(sample);
    }
    sample = sample.replace(/\\"/g, '"');
    this.auth = getExistinggroup(sample, /"authorization":\s?"([^"]+)"/);
    this.application_id = getExistinggroup(
      sample,
      /"application_id":\s?"(\d+)"/,
    );
    this.guild_id = getExistinggroup(sample, /"guild_id":\s?"(\d+)"/);
    this.channel_id = getExistinggroup(sample, /"channel_id":\s?"(\d+)"/);
    this.session_id = getExistinggroup(sample, /"session_id":\s?"([^"]+)"/);

    // this.DISCORD_TOKEN = getExistinggroup(sample, /DISCORD_TOKEN=\s?([^\s]+)/);
    // this.DISCORD_BOTID = getExistinggroup(sample, /DISCORD_BOTID=\s?([\d]+)/);

    this.commandCache = new CommandCache(this.channel_id, this.auth);
    // this.cookie = getExistinggroup(sample, / "cookie":\s?"([^"]+)"/);
    // this.x_super_properties = getExistinggroup(sample, / "x-super-properties":\s?"([^"]+)"/);
    // this.x_discord_locale = getExistinggroup(sample, / "x-discord-locale":\s?"([^"]+)"/);
  }

  // public async connectDiscordBot(): Promise<void> {
  //   if (!this.DISCORD_TOKEN) {
  //     throw Error("no DISCORD_TOKEN available");
  //   }
  //
  //   const client = new DiscordJs.Client({
  //     intents: [ DiscordJs.GatewayIntentBits.Guilds], // , DiscordJs.GatewayIntentBits.GuildMessages
  //   });
  //   client.on("ready", () => {
  //     if (client.user) {
  //       logger.info(`Logged in as ${client.user.tag}!`);
  //     }
  //   });
  //   // client.on("message", (msg) => {
  //   //   if (msg.content === "ping") msg.reply("pong");
  //   // });
  //   client.on('interactionCreate', async interaction => {
  //     if (!interaction.isChatInputCommand()) return;
  //
  //     if (interaction.commandName === 'ping') {
  //       await interaction.reply('Pong!');
  //     }
  //   });
  //   logger.info('login... ', this.DISCORD_TOKEN)
  //   const resp = await client.login(this.DISCORD_TOKEN);
  //   logger.info('done:', resp);
  // }

  private get headers() {
    return {
      authorization: this.auth,
      // cookie: this.cookie,
    };
  }

  private buildPayload(cmd: Command): Payload {
    const payload: Payload = {
      type: 2,
      application_id: this.application_id,
      guild_id: this.guild_id,
      channel_id: this.channel_id,
      session_id: this.session_id,
      data: {
        version: cmd.version,
        id: cmd.id,
        name: cmd.name,
        type: 1,
        options: [],
        application_command: cmd,
        attachments: [],
      },
    };
    return payload;
  }

  /**
   * invoke /settings in discord bot..
   * @param params
   */

  async settings(): Promise<number> {
    const cmd = await this.commandCache.getCommand("settings");

    const payload: Payload = this.buildPayload(cmd);
    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      // no content;
      return response.status;
    }
    throw new Error(
      `settings return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  /**
   * enable relax mode
   */
  async relax(): Promise<number> {
    const cmd = await this.commandCache.getCommand("relax");
    const payload: Payload = this.buildPayload(cmd);
    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      // no content;
      return response.status;
    }
    throw new Error(
      `relax return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  /**
   * enable fast mode
   */
  async fast(): Promise<number> {
    const cmd = await this.commandCache.getCommand("fast");
    const payload: Payload = this.buildPayload(cmd);
    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      // no content;
      return response.status;
    }
    throw new Error(
      `fast return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  async imagine(prompt: string): Promise<DiscordMessage> {
    const startId = new SnowflakeObj(-this.MAX_TIME_OFFSET).encode();
    const cmd = await this.commandCache.getCommand("imagine");
    const payload: Payload = this.buildPayload(cmd);
    payload.data.options = [{ type: 3, name: "prompt", value: prompt }];
    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      const msg = await this.waitMessage({
        prompt,
        startId,
        maxWait: 3000,
      });
      return msg;
    }
    throw new Error(
      `imagine return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  private async describe(attachment: UploadSlot): Promise<number> {
    const cmd = await this.commandCache.getCommand("describe");
    const payload: Payload = this.buildPayload(cmd);
    const { id, upload_filename: uploaded_filename } = attachment;
    payload.data.options = [{ type: 11, name: "image", value: id }];
    const filename = uploaded_filename.replace(/.+\//, "");
    payload.data.attachments = [{ id, filename, uploaded_filename }];

    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      // no content;
      return response.status;
    }
    throw new Error(
      `describe return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  private async blend(
    attachments: UploadSlot[],
    dimensions?: `${number}:${number}`,
  ): Promise<number> {
    const cmd = await this.commandCache.getCommand("blend");
    const payload: Payload = this.buildPayload(cmd);
    payload.data.attachments = [];
    payload.data.options = [];
    for (let i = 1; i <= attachments.length; i++) {
      const { id, upload_filename: uploaded_filename } = attachments[i - 1];
      const filename = uploaded_filename.replace(/.+\//, "");
      payload.data.options.push({ type: 11, name: `image${i}`, value: id });
      payload.data.attachments.push({ id, filename, uploaded_filename });
    }

    if (dimensions) {
      payload.data.options.push({
        type: 3,
        name: `dimensions`,
        value: `--ar ${dimensions}`,
      });
    }

    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      // no content;
      return response.status;
    }
    throw new Error(
      `blend return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  // setSettingsRelax(): Promise<number> {
  //   // the messageId should be update
  //   return this.callCustom(
  //     "1101102102157205574",
  //     "MJ::Settings::RelaxMode::on",
  //     MessageFlags.Ephemeral,
  //   );
  // }
  //
  // setSettingsFast(): Promise<number> {
  //   // the messageId should be update
  //   return this.callCustom(
  //     "1101102102157205574",
  //     "MJ::Settings::RelaxMode::off",
  //     MessageFlags.Ephemeral,
  //   );
  // }

  public async callCustomComponents(
    parentId: Snowflake,
    button: APIButtonComponentWithCustomId,
  ): Promise<DiscordMessage> {
    if (!button.disabled && button.style !== ButtonStyle.Primary) {
      await this.callCustom(parentId, button.custom_id);
    } else {
      logger.warn(
        `The requested action ${button.custom_id} had already been processed, just looking for a previous result.`,
      );
    }
    return await this.waitComponents(parentId, button);
  }

  private async callCustom(
    messageId: Snowflake,
    custom_id: string,
    message_flags = 0,
  ): Promise<number> {
    if (!custom_id) {
      throw Error("custom_id is empty");
    }
    const payload: Payload = {
      type: ApplicationCommandType.Message, // 3
      application_id: this.application_id,
      guild_id: this.guild_id,
      channel_id: this.channel_id,
      session_id: this.session_id,
      message_flags,
      message_id: messageId,
      data: { component_type: 2, custom_id: custom_id },
    };
    const response = await this.doInteractions(payload);
    return response.status;
  }

  private async doInteractions(payload: Payload): Promise<Response> {
    const formData = new FormData();
    payload.nonce = new SnowflakeObj().encode();
    formData.append("payload_json", JSON.stringify(payload));
    const response = await fetch(interactions, {
      method: "POST",
      body: formData,
      headers: this.headers,
    });
    return response;
  }

  /**
   * wait for an upscale or a Variant
   * @param comp
   */
  async waitComponents(
    parentId: Snowflake,
    button: APIButtonComponentWithCustomId,
    maxWait = 360,
  ): Promise<DiscordMessage> {
    let type: ResponseType | undefined;
    const label = button.label || button.emoji?.name || "ERROR";
    let imgId: string | undefined = undefined;
    if (label.startsWith("V") || label == "Make Variations") {
      type = "variations";
      imgId = ""; // image Id is not specified in title for variations.
    } else if (label.startsWith("U")) {
      type = "upscale";
      imgId = label;
    } else if (label === REROLL) {
      type = undefined;
      imgId = undefined;
    } else {
      throw Error("waitComponents only support upscale and variations");
    }
    const waitParams: WaitOptions = {
      maxWait,
      type,
      startId: parentId,
      imgId: imgId,
      parentId,
    };
    // logger.info(`Waiting for`, waitParams);
    const msg = await this.waitMessage(waitParams);
    return msg;
  }

  /**
   * Wait for a message in the channel using a multiple cryteria, critera can be:
   * - prompt: requested prompt
   * - name: used as filename for /describe
   * - maxWait: max wait iteration
   * - type: what kind of resond are you waiting for, can be "variations" | "grid" | "upscale" | "describe"
   * - imgId: use for upscale, can be 1 2 3 or 4
   * - startId: do not look for message older than the initial request.
   * - parent: filter by parent request
   */
  public async waitMessage(
    opts: WaitOptions = {},
  ): Promise<DiscordMessage> {
    const counters = {
      request: 0,
      message: 0,
      hit: false,
      hitRefresh: 0,
    };
    let { maxWait = 1000 } = opts;
    let imgId = 0;
    if (opts.imgId) {
      if (typeof opts.imgId === "number") {
        imgId = opts.imgId as 1 | 2 | 3 | 4;
      } else {
        imgId = Number(opts.imgId.replace(/[^0-9]+/g, "")) as 1 | 2 | 3 | 4;
      }
    }
    let startId = opts.startId || "";
    /** called once the correct message had been located */
    const follow = async (
      msg: DiscordMessage,
    ): Promise<DiscordMessage | null> => {
      const msgid = msg.id;
      let prevCompletion = -2;
      counters.hit = true;
      logger.info(`waitMessage for prompt message found`, msgid, msg.content);
      for (let i = 0; i < maxWait; i++) {
        if (!msg.prompt) {
          logger.error(`lose track of the current progress with message`, msg);
          throw new Error(`failed to extract prompt from ${msg.content}`);
        }
        if (
          msg.prompt.completion !== undefined &&
          prevCompletion !== msg.prompt.completion
        ) {
          prevCompletion = msg.prompt.completion;
          if (prevCompletion == -1) {
            logger.info(`wait for the prompt in Queue`);
          } else if (prevCompletion === 1) {
            logger.info(`waitMessage found a 100% process done message`);
          } else {
            logger.info(
              `follow message completion: (${(prevCompletion * 100).toFixed(0)}%)`,
            );
          }
        }
        if (msg.prompt.completion === 1) return msg;
        // if (msg.attachments.length && msg.attachments[0].url) { console.log(msg.attachments[0]); }
        await wait(1000);
        msg = await this.getMessageById(msgid);
        counters.hitRefresh++;
        // console.log('follow1', msg.prompt?.source);
        // console.log('follow2', msg.prompt?.completion);
      }
      return null;
    };

    const lookFor = async (
      messages: DiscordMessage[],
    ): Promise<DiscordMessage | null> => {
      counters.message += messages.length;
      // maintain the last message Id;
      messages.forEach((item) => {
        if (item.id > startId) startId = item.id;
      });
      let matches = messages;
      matches = matches.filter((item) => item.prompt); // keep only parssable messages;
      matches = matches.filter((item) => item.author.id === this.application_id); // keep only message from Discord bot
      if (opts.prompt) { // filter by prompt
        matches = matches.filter((item) => {
          const itemPrompt = item.prompt!.prompt;
          const itemPromptLt = itemPrompt.replace(/ --[^ ]+ [\d\w]+$/, "");
          return opts.prompt === itemPrompt || opts.prompt === itemPromptLt;
        });
      }
      if (opts.parentId) {
        matches = matches.filter((item) => item.referenced_message && item.referenced_message.id === opts.parentId);
      }
      if (opts.type) {
        matches = matches.filter((item) => item.prompt!.type === opts.type);
      }
      if (opts.name) {
        matches = matches.filter((item) => item.prompt!.name === opts.name);
      }
      if (opts.imgId) {
        matches = matches.filter((item) => item.prompt!.name.includes(`#${imgId}`));
      }
      if (!matches.length) return null;
      if (matches.length > 1) {
        logger.error(
          "warning multiple message match your waiting request! review your criterion:",
          opts,
        );
      }
      return await follow(matches[0]);
    };
    const limit = startId ? 100 : 50;
    if (maxWait === 0) {
      maxWait = 1;
    }
    for (let i = 0; i < maxWait; i++) {
      const msgs: DiscordMessage[] = await this.getMessages({
        limit,
        after: startId,
      });
      counters.request++;
      if (i == 0 && startId) {
        logger.info(
          `waitMessage 1st request gets ${msgs.length} messages, Will retry one per sec up to ${maxWait} times`,
        );
      } else {
        if (msgs.length) {
          logger.info(
            `waitMessage ${i}th request gets ${msgs.length} messages`,
          );
        }
      }
      // debugging get back in time and get the previous msg
      // if (msg.length === 0) {
      //   msg = await this.getMessages({
      //     limit: 1,
      //   });
      //   console.log(msg[0]);
      // }
      if (msgs.length) {
        const results = await lookFor(msgs);
        if (results) return results;
      }
      await wait(1000);
    }
    if (counters.hit) {
      throw Error(
        `waitMessage failed without finding the expected message after ${counters.request} requests, ${counters.message} messaages tested`,
      );
    }
    throw Error(
      `waitMessage still waiting for a 100% processed status after ${counters.hitRefresh} refresh`,
    );
  }

  /**
   * get message from the chanel
   * @param params
   */
  public async getMessages(
    params: RESTGetAPIChannelMessagesQuery = {},
  ): Promise<DiscordMessage[]> {
    const url = new URL(
      `https://discord.com/api/v10/channels/${this.channel_id}/messages`,
    );
    const searchParams = new URLSearchParams(url.search); // generic import prev params
    for (const [key, value] of Object.entries(params)) {
      const strValue = value.toString();
      if (strValue) searchParams.set(key, strValue);
    }
    url.search = searchParams.toString();
    const response = await fetch(url.toString(), { headers: this.headers });
    if (response.status === 200) {
      const msgs: APIMessage[] = (await response.json()) as APIMessage[];
      // msgs.forEach((msg) => MsgsCache.set(msg.id, msg));
      return msgs.map((msg) => new DiscordMessage(this, msg));
    }
    throw new Error(
      `getMessages return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  /**
   * retrive a single message by id using the discord api get messages V10
   * @param id message Snowflake id
   * @returns the message
   */
  public async getMessageById(id: Snowflake): Promise<DiscordMessage> {
    // "Only bots can use this endpoint"
    //if (false) {
    //    const url = `https://discord.com/api/v12/channels/${this.channel_id}/messages/${id}`;
    //    const response = await fetch(url, {
    //        method: "GET",
    //        headers: this.headers,
    //    });
    //    if (response.status === 200) {
    //        return response.json();
    //    }
    //    throw new Error(response.statusText + ' ' + await response.text());
    //} else {
    // use retrieveMessages instead of get messages
    const data: DiscordMessage[] = await this.getMessages({
      around: id,
      limit: 1,
    });
    if (!data.length) {
      throw new Error("no message found, around " + id);
    }
    return data[0];
    // }
  }

  /**
   * prepare an attachement to upload an image.
   */
  public async attachments(
    ...files: { filename: string; file_size: number; id: number | string }[]
  ): Promise<{ attachments: UploadSlot[] }> {
    const headers = { ...this.headers, "content-type": "application/json" };
    const url = new URL(
      `https://discord.com/api/v9/channels/${this.channel_id}/attachments`,
    );
    const body = { files }; //  [{ filename, file_size, id }]
    // filename: "aaaa.jpeg", file_size: 66618, id: "16"
    const response = await fetch(url.toString(), {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    if (response.status === 200) {
      const atts = (await response.json()) as { attachments: UploadSlot[] };
      return atts;
    }
    throw new Error(
      `Attachments return ${response.status} ${response.statusText} ${await response
        .text()}`,
    );
  }

  /**
   * Upload an image to an upload slot provided by the attachments function.
   * @param slot use uploadUrl to put the image
   * @returns
   */
  public async uploadImage(
    slot: UploadSlot,
    data: ArrayBufferLike,
    contentType: string,
  ): Promise<void> {
    const headers = { "content-type": contentType };
    const response = await fetch(slot.upload_url, {
      method: "PUT",
      headers,
      body: new Uint8Array(data),
    });
    if (!response.ok) {
      throw new Error(
        `uploadImage return ${response.status} ${response.statusText} ${await response
          .text()}`,
      );
    }
  }
  /**
   * invoke /describe on an image from an URL.
   * @param imageUrl url of the image
   * @return a list of 4 prompt suggested by Midjourney
   */
  public async describeUrl(imageUrl: string): Promise<string[]> {
    const url = new URL(imageUrl);
    const filename = url.pathname.replaceAll(/\//g, "_"); // "pixelSample.webp";
    const imageData = await download(imageUrl, filename);
    return this.describeImage(filename, imageData);
  }
  /**
   * invoke /describe on an image provided as a buffer
   * @param filename image name
   * @param imageData the buffer containing the image
   * @param contentType the content type (can be autodetect from extention)
   * @return a list of 4 prompt suggested by Midjourney
   */

  public async describeImage(
    filename: string,
    imageData: ArrayBufferLike,
    contentType?: string,
  ): Promise<string[]> {
    contentType = contentType || filename2Mime(filename);
    const id = Date.now();
    // accept up to 5 sec offset
    const startId = new SnowflakeObj(-this.MAX_TIME_OFFSET).encode();
    const { attachments } = await this.attachments({
      filename,
      file_size: imageData.byteLength,
      id,
    });
    const [attachment] = attachments;
    await this.uploadImage(attachment, imageData, contentType);
    await this.describe(attachment);
    const realfilename = filename.replace(/^_/, "");
    for (let i = 0;; i++) {
      try {
        const msg = await this.waitMessage({
          type: "describe",
          name: realfilename,
          maxWait: 1,
          startId,
        });
        if (msg.prompt) {
          return msg.prompt.prompt.split(/\n+/g).map((p) => p.slice(4));
        }
      } catch (e) {
        if (i > 5) {
          throw e;
        }
      }
    }
  }

  public async blendImage(
    images: {
      filename: string;
      imageData: ArrayBufferLike;
      contentType?: string;
    }[],
    dimensions?: `${number}:${number}`,
  ): Promise<void> {
    images.forEach((image) => image.contentType = image.contentType || filename2Mime(image.filename));
    const id0 = Date.now();
    // const startId = new SnowflakeObj(-this.MAX_TIME_OFFSET).encode();

    const { attachments } = await this.attachments(...images.map((img, id) => ({
      filename: img.filename,
      file_size: img.imageData.byteLength,
      id: id0 + id,
    })));

    for (let i = 0; i < images.length; i++) {
      await this.uploadImage(
        attachments[i],
        images[i].imageData,
        images[i].contentType || "",
      );
    }

    // const [attachment] = attachments;
    await this.blend(attachments, dimensions);
    // TODO implements wait
    // const realfilename = filename.replace(/^_/, "");
    // for (let i = 0; i < 5; i++) {
    //   const msg = await this.waitMessage({
    //     type: "describe",
    //     name: realfilename,
    //     maxWait: 1,
    //     startId,
    //   });
    //   if (msg && msg.prompt) {
    //     logger.info(msg);
    //     return msg.prompt.prompt.split(/\n+/g).map((p) => p.slice(4));
    //   }
    // }
    // throw Error("Wait for describe response failed");
  }
}

export default Midjourney;
