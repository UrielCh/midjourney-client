import { Midjourney } from "../mod.ts";
import nativebird from "npm:nativebird";
import { progressLogger } from "./progressLogger.ts";

const client = new Midjourney("interaction.txt");
await client.connectWs();
// client.setDiscordChannelUrl("https://discord.com/channels/662267976984297473/995431151084773486"); // change yout channel

const prompts: { prompt: string; seed: number }[] = [];
const basePrompt = "einstein mathematician studying at school --c 100";
for (let i = 1; i <= 40; i++) {
  const seed = 120 + i;
  const prompt = `${basePrompt} --seed ${seed}`;
  prompts.push({ prompt, seed });
}

await nativebird.map(prompts, async ({ prompt, seed }) => {
  const msg = await client.imagine(prompt, progressLogger(`seed #${seed}`));
  await msg.download(0, "images");
}, { concurrency: 3 });
