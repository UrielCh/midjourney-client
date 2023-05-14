import { Midjourney } from "../mod.ts";

const client = new Midjourney("interaction.txt");
const msgs = await client.getMessages({ limit: 3 });

console.log("last 5 messages:");
for (const msg of msgs) {
  console.log("");
  console.log("content: " + msg.content);
  console.log("prompt: ", msg.prompt);
  console.log("Partent Type: ", msg.parentInteraction);
}
