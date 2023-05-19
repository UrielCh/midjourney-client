import { Midjourney } from "../mod.ts";
import { progressLogger } from "./progressLogger.ts";
import { sampleUrls } from "./sampleUrls.ts";

/**
 * Upscale the first none upscaled images in chat, searching from the newest to the oldest images
 */
const client = new Midjourney("interaction.txt");
// const [msg] = await client.getMessages({limit: 1});
// msg.download(0, "regen.png");
const sourceImg1 = sampleUrls[(Math.random() * sampleUrls.length) | 0];
const sourceImg2 = sampleUrls[(Math.random() * sampleUrls.length) | 0];
await client.connectWs();
const msg = await client.blendUrl([sourceImg1, sourceImg2], "2:3", progressLogger("Blend 2 images"));
await msg.download(0, "blend.png");
