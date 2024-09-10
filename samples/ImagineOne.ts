import { Midjourney } from "../mod.ts";
import { progressLogger } from "./progressLogger.ts";

const client = new Midjourney("interaction.txt");
await client.connectWs();
//Use the --fast --turbo or --relax command to explicitly set the generation speed.
// const basePrompt = "einstein mathematician studying at school --relax";
const basePrompt = "Harry Potter and the Prisoner of Azkaban cover --relax";

const msg = await client.imagine(basePrompt, progressLogger(`seed #random`));
await msg.download(0, "images");
client.close();
