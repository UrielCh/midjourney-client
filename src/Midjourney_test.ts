import { assert, assertEquals } from "../dev_deps.ts";
import Midjourney from "./Midjourney.ts";
import { join } from "../dev_deps.ts";
import { wait } from "./utils.ts";

export function getMidjourney(): Midjourney | null {
  let file = "./interaction.txt";
  const rearchPaths = [];
  for (let i = 0; i < 4; i++) {
    try {
      const content = Deno.readTextFileSync(file);
      return new Midjourney(content);
    } catch (_e) {
      rearchPaths.push(file);
      file = join("..", file);
    }
  }
  console.error("no interaction.txt available for auth in " + rearchPaths.join(", "));
  return null;
}

Deno.test(async function getAllMsgs() {
  const client = getMidjourney();
  const limit = 5;
  await wait(1000);
  if (!client) {
    assert(1);
    return;
  }
  const msgs = await client.getMessages({ limit });
  //for (let i=0; i<msgs.length; i++) {
  //  console.log(msgs[i].prompt!.name);
  //}
  // await client.waitMessage({})
  // console.log(msgs[0].prompt);
  // const { commandCache } = client;
  assertEquals(msgs.length, limit);
});
