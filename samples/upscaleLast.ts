import { Midjourney } from "../mod.ts";

/**
 * Upscale the first none upscaled images in chat, searching from the newest to the oldest images
 */
const client = new Midjourney("interaction.txt");
const msgs = await client.getMessages();
main:
for (const msg of msgs) {
  if (!msg.canUpscale()) {
    continue;
  }
  for (let i = 1; i <= 4; i++) {
    if (msg.canUpscale(i)) {
      console.log(`Upscaling image ${i} from ${msg.id}: ${msg.prompt?.prompt}`);
      const result = await msg.upscale(i);
      await result.download(0, "images");
      break main;
    }
  }
}
