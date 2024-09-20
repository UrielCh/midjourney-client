import { Midjourney } from "../mod.ts";

/**
 * Dump the auth token, guild id and channel id to the console,
 * so they can be pasted into the environment variables
 */
const client = new Midjourney("interaction.txt");

console.log(`export SALAI_TOKEN="${client.auth}";`);
console.log(`export SERVER_ID="${client.guild_id}";`);
console.log(`export CHANNEL_ID="${client.channel_id}";`);
