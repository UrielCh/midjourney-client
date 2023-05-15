import { Midjourney } from "../mod.ts";
import { SnowflakeObj } from "../mod.ts";

/**
 * Upscale all withing the 20 last images generated 2 hours ago
 */
const client = new Midjourney("interaction.txt");
await client.connectWs();
const snowflake = new SnowflakeObj(-2 * 60 * 60 * 1000);
// or select the exact time
// snowflake.timestamp = new Date('2023-05-03T05:03:34.593Z').getTime();
const msgs = await client.getMessages({ after: snowflake.encode(), limit: 20 });

for (const msg of msgs) {
  if (!msg.canUpscale()) {
    continue;
  }
  for (let i = 1; i <= 4; i++) {
    if (msg.canUpscale(i)) {
      console.log(`Upscaling image ${i} from ${msg.id}: ${msg.prompt?.prompt}`);
      const result = await msg.upscale(i);
      await result.download(0, "images");
    }
  }
}
