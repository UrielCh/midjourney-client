const readmeContentOriginal = Deno.readTextFileSync("readme.md");
const jsonStr = Deno.readTextFileSync("deno.jsonc");
const jsonConf = JSON.parse(jsonStr) as { version: string };

let readmeContent = readmeContentOriginal.replaceAll(
  /https:\/\/deno.land\/x\/midjourney_discord_api@v[\d.]+\/mod.ts/g,
  `https://deno.land/x/midjourney_discord_api@v${jsonConf.version}/mod.ts`,
).replaceAll(
  /version: "[\d.]+"/g,
  `version: "${jsonConf.version}"`,
);

// update current version in readme
if (readmeContent !== readmeContentOriginal) {
  Deno.writeTextFileSync("README.md", readmeContent);
}

// only for JSR

readmeContent = readmeContent.replaceAll(
  /https:\/\/deno.land\/x\/midjourney_discord_api@v[\d.]+\/mod.ts/g,
  `jsr:@u4/midjourney@${jsonConf.version}/mod`,
);

readmeContent = readmeContent.replaceAll(
  /# midjourney-discord-api/g,
  `# @u4/midjourney`,
);

// Write the updated content back to the mod.ts file
Deno.writeTextFileSync(
  "mod.ts",
  `/**
* ${readmeContent}
* @module
*/

export { default as default } from "./src/Midjourney.ts";
export { default as Midjourney } from "./src/Midjourney.ts";
export { SnowflakeObj } from "./src/SnowflakeObj.ts";
export type { UploadSlot, WaitOptions } from "./src/Midjourney.ts";
export type { ComponentsSummary, SplitedPrompt } from "./src/DiscordMessage.ts";
export { DiscordMessage } from "./src/DiscordMessage.ts";
export { MIDJOURNEY_CHANNELS } from "./src/Constants.ts";`,
);
