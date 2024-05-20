import { Midjourney } from "../mod.ts";

/**
 * Variant the last image available in chat
 */
const client = new Midjourney("interaction.txt");
await client.connectWs();
const msgs = await client.getMessages();
main:
for (const msg of msgs) {
  if (!msg.canVariant()) {
    continue;
  }
  for (let i = 1; i <= 4; i++) {
    const v = msg.canVariant(i);
    if (v) {
      console.log(`Variant image ${v.custom_id} from ${msg.id}: ${msg.prompt?.prompt}`);
      const result = await msg.variant(i);
      await result.download(0, "images");
      break main;
    }
  }
}
client.close();
