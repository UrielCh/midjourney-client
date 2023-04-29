import type {
  APIActionRowComponent,
  APIAttachment,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APIEmbed,
  APIMessageActionRowComponent,
  Snowflake,
} from "../deps.ts";
import { ButtonStyle } from "../deps.ts";
import type { DiscordMessage, ResponseType } from "./models.ts";

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
  type?: ResponseType;
  name: string;
  completion?: number; // 0..1
}

export class componentData {
  public processed: boolean;
  public label: string;
  public custom_id: string;
  public url: string;

  constructor(
    public readonly parentId: Snowflake,
    src: APIButtonComponentWithCustomId | APIButtonComponentWithURL,
  ) {
    this.processed = src.style === ButtonStyle.Primary; // 1 is primary button means that it had already been click
    this.label = src.label || src.emoji?.name || "N/A";
    if ("custom_id" in src) {
      this.custom_id = src.custom_id || "";
      this.url = "";
    } else {
      this.custom_id = "";
      this.url = src.url || "";
      if (this.url) {
        this.processed = true;
      }
    }
  }
}

export function extractPrompt(content: string): SplitedPrompt | undefined {
  let m = content.match(/^\*\*(.+)\*\* - (.+)$/); // (.+) <@(\d+)>
  if (!m) {
    return undefined;
  }

  const prompt: SplitedPrompt = {
    prompt: m[1],
    source: content,
    name: "",
  };
  let extra = m[2];
  if (extra.endsWith(" (fast)")) {
    prompt.mode = "fast";
    extra = extra.substring(0, extra.length - 7);
  } else if (extra.endsWith(" (relaxed)")) {
    prompt.mode = "relaxed";
    extra = extra.substring(0, extra.length - 10);
  }
  m = extra.match(/^<@(\d+)> \(Open on website for full quality\)$/);
  if (m) {
    prompt.id = m[1];
    prompt.completion = 1;
    prompt.type = "grid";
    return prompt;
  }

  m = extra.match(/^Variations by <@(\d+)>$/);
  if (m) {
    prompt.id = m[1];
    prompt.completion = 1;
    prompt.type = "variations";
    return prompt;
  }

  m = extra.match(
    /^Variations by <@(\d+)> \(Open on website for full quality\)$/,
  );
  if (m) {
    prompt.id = m[1];
    prompt.completion = 1;
    prompt.type = "variations";
    return prompt;
  }

  m = extra.match(/^Image #(\d) <@(\d+)>$/);
  if (m) {
    prompt.id = m[2];
    prompt.completion = 1;
    prompt.type = "upscale"; // or variations
    prompt.name = `Image #${m[1]}`;
    return prompt;
  }

  m = extra.match(/^<@(\d+)> \((\d+)%\)$/);
  if (m) {
    prompt.id = m[1];
    prompt.completion = parseInt(m[2]) / 100;
    prompt.type = "grid";
    return prompt;
  }

  m = extra.match(/^<@(\d+)> \(Waiting to start\)$/);
  if (m) {
    prompt.id = m[1];
    prompt.completion = -1;
    prompt.type = "grid";
    return prompt;
  }
  m = extra.match(/^<@(\d+)>$/);
  if (m) {
    prompt.id = m[1];
    prompt.completion = 1;
    prompt.type = "grid";
    return prompt;
  }

  if (!extra.length) {
    return prompt;
  }
  console.log("failed to extract data from:", content);

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

function getDataFromComponents(
  parentId: Snowflake,
  srcs: APIActionRowComponent<APIMessageActionRowComponent>[],
): componentData[] {
  const out: componentData[] = [];
  for (const src of srcs) {
    for (const c of src.components) {
      if ("custom_id" in c && ("label" in c || "emoji" in c)) {
        out.push(new componentData(parentId, c)); //  as APIButtonComponentWithCustomId
      } else if ("label" in c && "url" in c) {
        out.push(new componentData(parentId, c)); //  as APIButtonComponentWithURL
      } else {
        console.log(c);
      }
    }
  }
  return out;
}

export class DiscordMessageHelper {
  public content: string;
  public prompt?: SplitedPrompt;
  public reference?: DiscordMessageHelper;

  public author: { id: Snowflake; username: string };
  public mentions: { id: Snowflake; username: string }[];

  public attachments: APIAttachment[];
  public components: ComponentsSummary[];
  public id: Snowflake;

  constructor(public source: DiscordMessage) {
    this.id = source.id;
    this.prompt = extractPrompt(source.content);
    this.content = source.content;
    this.author = { id: source.author.id, username: source.author.username };
    this.mentions = source.mentions.map((u) => ({
      id: u.id,
      username: u.username,
    }));
    this.attachments = source.attachments;
    this.components = getDataFromComponents(source.id, source.components || []);
    if (source.referenced_message) {
      this.reference = new DiscordMessageHelper(source.referenced_message);
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
              type: "describe",
              name: embeds.image.url.replace(/.+\//, ""),
              prompt: description,
              completion: 1,
            };
          }
        } else {
          // embeds not available yet.
          this.prompt = {
            source: "",
            type: "describe",
            name: "",
            prompt: "",
            completion: -1,
          };
        }
      } else {
        // console.log("interaction Name: ", name);
        // console.log("interaction source.embeds: ", source.embeds);
      }
    }
    //if (custom_ids.includes("MJ::Job::PicReader::")) {
  }

  // isImagineResult(): boolean {
  //     if (!this.prompt)
  //         return false;
  //     if (!this.prompt.note)
  //         return false;
  //     return true;
  // }
  //
  // isUpscaleResult(): boolean {
  //     if (!this.prompt)
  //         return false;
  //     if (!this.prompt.name) // name is empty when it is a prompt
  //         return false;
  //     return true;
  // }

  getComponents(processed: boolean, name?: string): ComponentsSummary[] {
    let list = this.components.filter((a) => a.processed === processed);
    if (name) {
      list = list.filter((a) => a.label.startsWith(name));
    }
    return list;
  }
}
