import {
  ComponentsSummary,
  DiscordMessageHelper,
} from "./DiscordMessageHelper.ts";
import { SnowflakeObj } from "./SnowflakeObj.ts";
// import * as cmd from "./applicationCommand.ts";
import { CommandCache } from "./CommandCache.ts";
import type {
  Command,
  DiscordMessage,
  Payload,
  ResponseType,
} from "./models.ts";
import { ApplicationCommandType, MessageFlags } from "../deps.ts";
import type { RESTGetAPIChannelMessagesQuery, Snowflake } from "../deps.ts";
// import MsgsCache from "./MsgsCache.ts";
import { logger } from "../deps.ts";

function getExistinggroup(text: string, reg: RegExp): string {
  const m = text.match(reg);
  if (!m) {
    throw Error(
      `failed to find ${reg} in provided sample of size:${text.length}`,
    );
  }
  return m[1];
}

async function download(
  url: string,
  filename: string,
): Promise<ArrayBufferLike> {
  try {
    const content: Uint8Array = await Deno.readFile(filename);
    return content.buffer;
  } catch (_e) {
    const data = await (await fetch(url)).arrayBuffer();
    logger.info("saving downloaded file to ", filename);
    Deno.writeFile(filename, new Uint8Array(data));
    return data;
  }
}

const interactions = "https://discord.com/api/v9/interactions";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  parent?: Snowflake;
}

export class Midjourney {
  readonly auth: string;
  readonly application_id: string;
  readonly guild_id: string;
  readonly channel_id: string;
  readonly session_id: string;
  readonly commandCache: CommandCache;
  // readonly cookie: string;
  //readonly x_super_properties: string;
  //readonly x_discord_locale: string;

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
    this.commandCache = new CommandCache(this.channel_id, this.auth);
    // this.cookie = getExistinggroup(sample, / "cookie":\s?"([^"]+)"/);
    // this.x_super_properties = getExistinggroup(sample, / "x-super-properties":\s?"([^"]+)"/);
    // this.x_discord_locale = getExistinggroup(sample, / "x-discord-locale":\s?"([^"]+)"/);
  }

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

  protected log(...args: unknown[]) {
    console.log(new Date().toISOString(), ...args);
  }

  async settings(): Promise<number> {
    const cmd = await this.commandCache.getCommand("settings");

    const payload: Payload = this.buildPayload(cmd);
    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      // no content;
      return response.status;
    }
    logger.error("status:", response.status, response.statusText);
    const body = await response.json();
    logger.error("statusText:", JSON.stringify(body, null, 2));
    return response.status;
  }

  async imagine(prompt: string): Promise<DiscordMessageHelper> {
    const startId = new SnowflakeObj(-5 * 1000).encode();
    const cmd = await this.commandCache.getCommand("imagine");
    const payload: Payload = this.buildPayload(cmd);
    payload.data.options = [{ type: 3, name: "prompt", value: prompt }];
    const response = await this.doInteractions(payload);
    if (response.status === 204) {
      const msg = await this.waitMessageOrThrow({
        prompt,
        startId,
        maxWait: 3000,
      });
      return msg;
    }
    logger.error("status:", response.status, response.statusText);
    const body = await response.json();
    logger.error("statusText:", JSON.stringify(body, null, 2));
    throw Error(`imagine failed with: ${response.statusText}`);
  }

  async describe(attachment: UploadSlot): Promise<number> {
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
    logger.error("status:", response.status, response.statusText);
    const body = await response.json();
    logger.error("statusText:", JSON.stringify(body, null, 2));
    throw Error(`imagine failed with: ${response.statusText}`);
  }

  setSettingsRelax(): Promise<number> {
    // the messageId should be update
    return this.callCustom(
      "1101102102157205574",
      "MJ::Settings::RelaxMode::on",
      MessageFlags.Ephemeral,
    );
  }

  setSettingsFast(): Promise<number> {
    // the messageId should be update
    return this.callCustom(
      "1101102102157205574",
      "MJ::Settings::RelaxMode::off",
      MessageFlags.Ephemeral,
    );
  }

  async callCustom2(button: ComponentsSummary): Promise<DiscordMessageHelper> {
    await this.callCustom(button.parentId, button.custom_id);
    return await this.waitComponents(button);
  }

  async callCustom(
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
    // console.log(await response.text());
    return response.status;
  }

  async doInteractions(payload: Payload): Promise<Response> {
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
    comp: ComponentsSummary,
    maxWait = 360,
  ): Promise<DiscordMessageHelper> {
    let type: ResponseType | undefined;
    let imgId = comp.label;
    if (comp.label.startsWith("V")) {
      type = "variations";
      imgId = ""; // image Id is not specified in title for variations.
    } else if (comp.label.startsWith("U")) {
      type = "upscale";
    } else {
      throw Error("waitComponents onlu support upscale and variations");
    }
    const msg = await this.waitMessageOrThrow({
      maxWait,
      type,
      startId: comp.parentId,
      imgId,
      parent: comp.parentId,
    });
    return msg;
  }

  async waitMessageOrThrow(
    opts: WaitOptions = {},
  ): Promise<DiscordMessageHelper> {
    const msgs = await this.waitMessage(opts);
    if (!msgs) {
      throw Error("Failed to wait for Message");
    }
    return msgs;
  }

  async waitMessage(
    opts: WaitOptions = {},
  ): Promise<DiscordMessageHelper | null> {
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

    const follow = async (
      msg: DiscordMessageHelper,
    ): Promise<DiscordMessageHelper | null> => {
      const msgid = msg.id;
      let prevCompletion = -2;
      logger.info(`waitMessage for prompt message found`, msgid, msg.content);
      for (let i = 0; i < maxWait; i++) {
        if (!msg.prompt) {
          console.log("----");
          console.log(msg);
          console.log("----");
          throw new Error(`failed to extract prompt from ${msg.content}`);
        }
        if (
          msg.prompt.completion !== undefined &&
          prevCompletion !== msg.prompt.completion
        ) {
          prevCompletion = msg.prompt.completion;
          if (prevCompletion == -1) {
            logger.info(`wait for prompt in Queue`);
          } else if (prevCompletion === 1) {
            logger.info(`follow message completion ready`);
          } else {
            logger.info(
              `follow message completion: (${
                (prevCompletion * 100).toFixed(0)
              }%)`,
            );
          }
        }
        if (msg.prompt.completion === 1) return msg;
        // if (msg.attachments.length && msg.attachments[0].url) { console.log(msg.attachments[0]); }
        await wait(2000);
        msg = await this.getMessageById(msgid);
        // console.log('follow1', msg.prompt?.source);
        // console.log('follow2', msg.prompt?.completion);
      }
      return null;
    };

    const lookFor = async (
      msgs: DiscordMessage[],
    ): Promise<DiscordMessageHelper | null> => {
      const messages = msgs.map((m) => new DiscordMessageHelper(m));
      // maintain the last message Id;
      messages.forEach((item) => { //
        if (item.id > startId) startId = item.id;
      });
      let matches = messages;
      matches = matches.filter((item) => item.prompt); // keep only parssable messages;
      matches = matches.filter((item) =>
        item.author.id === this.application_id
      ); // keep only message from Discord bot
      if (opts.prompt) { // filter by prompt
        matches = matches.filter((item) => {
          const itemPrompt = item.prompt!.prompt;
          const itemPromptLt = itemPrompt.replace(/ --[^ ]+ [\d\w]+$/, "");
          return opts.prompt === itemPrompt || opts.prompt === itemPromptLt;
        });
      }
      if (opts.parent) {
        matches = matches.filter((item) =>
          item.reference && item.reference.id === opts.parent
        );
      }
      if (opts.type) {
        matches = matches.filter((item) => item.prompt!.type === opts.type);
      }
      if (opts.name) {
        matches = matches.filter((item) => item.prompt!.name === opts.name);
      }
      if (opts.imgId) {
        matches = matches.filter((item) =>
          item.prompt!.name.includes(`#${imgId}`)
        );
      }
      if (!matches.length) return null;
      if (matches.length > 1) {
        logger.error(
          "warning multiple message match your waiting request! review your cryteria:",
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
      const msg: DiscordMessage[] = await this.getMessages({
        limit,
        after: startId,
      });
      if (i == 0 && startId) {
        logger.info(`First request in waitMessage get ${msg.length} messages`);
      }
      // if (msg.length === 0) {
      //   msg = await this.getMessages({
      //     limit: 1,
      //   });
      //   console.log(new DiscordMessageHelper(msg[0]));
      // }
      const results = await lookFor(msg);
      if (results) return results;
      await wait(1000);
    }
    return null;
  }

  async getMessagesHelper(
    params: RESTGetAPIChannelMessagesQuery = {},
  ): Promise<DiscordMessageHelper[]> {
    const messages = await this.getMessages(params);
    return messages.map((m) => new DiscordMessageHelper(m));
  }

  async getMessages(
    params: RESTGetAPIChannelMessagesQuery = {},
  ): Promise<DiscordMessage[]> {
    const url = new URL(
      `https://discord.com/api/v10/channels/${this.channel_id}/messages`,
    );
    const searchParams = new URLSearchParams(url.search); // generic import prev params
    for (const [key, value] of Object.entries(params)) {
      const strValue = value.toString();
      if (strValue) {
        searchParams.set(key, strValue);
      }
    }
    url.search = searchParams.toString();
    const response = await fetch(url.toString(), { headers: this.headers });
    if (response.status === 200) {
      const msgs: DiscordMessage[] = await response.json();
      // msgs.forEach((msg) => MsgsCache.set(msg.id, msg));
      return msgs;
    }
    throw new Error(response.statusText + " " + await response.text());
  }

  /**
   * retrive a single message by id using the discord api get messages V10
   * @param id
   * @returns
   */
  async getMessageById(id: string): Promise<DiscordMessageHelper> {
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
    return new DiscordMessageHelper(data[0]);
    // }
  }

  // 	XHRscience	XHRscience	XHRscience	XHRsearch?type=1&query=d&limit=7&include_applications=false	XHRscience	XHRsearch?type=1&query=de&limit=7&include_applications=false	XHRscience	XHRattachments	XHR0_1.png?upload_id=ADPycdsKxYT59eG_6VKbIeXSeFr8EyIu…ExL-CZheZ66YwWh0dAXF9GTgHr_dtZMTIK36XGdRAcKhXAIcu	XHRinteractions	XHRack	XHRversion.stable.json?_=5608652
  // {"files":[{"filename":"0_1.png","file_size":1775802,"id":"13"}]}
  async attachments(
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
      return response.json();
    }
    throw new Error(response.statusText + " " + await response.text());
  }

  /**
   * @param slot use uploadUrl to put the image
   * @returns
   */
  async uploadImage(
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
      throw new Error(`Failed to upload ArrayBuffer: ${response.statusText}`);
    }
  }

  async describeUrl(imageUrl: string): Promise<string[]> {
    const url = new URL(imageUrl);
    const filename = url.pathname.replaceAll(/\//g, "_"); // "pixelSample.webp";
    const imageData = await download(imageUrl, filename);
    return this.describeImage(filename, imageData);
  }

  async describeImage(
    filename: string,
    imageData: ArrayBufferLike,
    contentType?: string,
  ): Promise<string[]> {
    if (!contentType) {
      if (filename.endsWith(".webp")) {
        contentType = "image/webp";
      } else if (filename.endsWith(".jpeg")) {
        contentType = "image/jpeg";
      } else if (filename.endsWith(".jpg")) {
        contentType = "image/jpeg";
      } else if (filename.endsWith(".png")) {
        contentType = "image/png";
      } else {
        throw Error(`unknown extention in ${filename}`);
      }
    }

    const id = Date.now();
    // accept up to 5 sec offset
    const startId = new SnowflakeObj(-5 * 1000).encode();
    const { attachments } = await this.attachments({
      filename,
      file_size: imageData.byteLength,
      id,
    });
    const [attachment] = attachments;
    await this.uploadImage(attachment, imageData, contentType);
    await this.describe(attachment);
    const realfilename = filename.replace(/^_/, "");
    for (let i = 0; i < 5; i++) {
      const msg = await this.waitMessage({
        type: "describe",
        name: realfilename,
        maxWait: 1,
        startId,
      });
      if (msg && msg.prompt) {
        console.log(msg);
        return msg.prompt.prompt.split(/\n+/g).map((p) => p.slice(4));
      }
    }
    throw Error("Wait for describe response failed");
  }
}

export default Midjourney;
