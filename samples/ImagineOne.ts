import { Midjourney } from "../mod.ts";
import { progressLogger } from "./progressLogger.ts";

const client = new Midjourney("interaction.txt");
await client.connectWs();

const basePrompt = "einstein mathematician studying at school";

const msg = await client.imagine(basePrompt, progressLogger(`seed #random`));
await msg.download(0, "images");
client.close();
