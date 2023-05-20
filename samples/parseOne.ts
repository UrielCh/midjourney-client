import { MIDJOURNEY_CHANNELS, Midjourney } from "../mod.ts";
import { pc } from "../deps.ts";

const client = new Midjourney("interaction.txt");
client.setDiscordChannelUrl(MIDJOURNEY_CHANNELS.general1);
const msg = await client.getMessageById('1109430481621098507');
console.log("");
console.log(`${pc.green("content:")} ${msg.content}`);
if (msg.prompt) {
  console.log(`${pc.green("prompt:")} ${msg.prompt.source}`);
}
console.log(`${pc.green("Partent Type:")} ${msg.parentInteraction}`);
console.log(`${pc.green("componentsNames:")} ${msg.componentsNames}`);

console.log(JSON.stringify(msg.attachments[0], undefined, 2));
