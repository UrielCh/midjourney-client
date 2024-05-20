import { Midjourney } from "../mod.ts";
import { pc } from "../deps.ts";

const client = new Midjourney("interaction.txt");
const limit = 10;
const msgs = await client.getMessages({ limit });

console.log(`last ${pc.yellow("" + limit)} messages:`);
for (const msg of msgs) {
  console.log("");
  console.log(`${pc.green("content:")} ${msg.content}`);
  if (msg.prompt) {
    console.log(`${pc.green("prompt:")} ${msg.prompt.source}`);
  }
  console.log(`${pc.green("Partent Type:")} ${msg.parentInteraction}`);
}
client.close();
