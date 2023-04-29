import { assertEquals } from "../dev_deps.ts";
import Midjourney from "./Midjourney.ts";

import { existsSync, join } from "../dev_deps.ts";

export function getMidjourney() {
  let file = "interaction.txt";
  for (let i = 0; i < 4; i++) {
    if (existsSync(file)) {
      return new Midjourney(file);
    }
    file = join("..", file);
  }
  throw Error("no interaction.txt available for auth");
}

Deno.test(async function getAllMsgs() {
  const client = getMidjourney();
  const limit = 5;
  const msgs = await client.getMessages({ limit });
  //for (let i=0; i<msgs.length; i++) {
  //  console.log(new DiscordMessageHelper(msgs[i]).prompt!.name);
  //}
  // await client.waitMessage({})
  // console.log(new DiscordMessageHelper(msgs[0]).prompt);
  // const { commandCache } = client;
  assertEquals(msgs.length, limit);
});
