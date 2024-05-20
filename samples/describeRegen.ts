import { Midjourney } from "../mod.ts";
import { progressLogger } from "./progressLogger.ts";
import { sampleUrls } from "./sampleUrls.ts";

/**
 * Upscale the first none upscaled images in chat, searching from the newest to the oldest images
 */
const client = new Midjourney("interaction.txt");
await client.connectWs();
// const [msg] = await client.getMessages({limit: 1});
// msg.download(0, "regen.png");
const sourceImg = sampleUrls[(Math.random() * sampleUrls.length) | 0];
const prompts = await client.describeUrl(sourceImg, progressLogger("describeUrl"));
const prompt = prompts[(Math.random() * 4) | 0];
console.log("Using prompt:", prompt);
const msg = await client.imagine(prompt, progressLogger("imagine"));
if (await msg.download(0, "regen.png")) {
  console.log("result downloaded as regen.png");
} else {
  console.log("result downloaded Failed");
}
client.close();
// 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟
