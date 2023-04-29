import { assertEquals } from "../dev_deps.ts";
import Midjourney from "./Midjourney.ts";

Deno.test(async function getAllMsgs() {
  const client = new Midjourney("interaction.txt");
  const limit = 5;
  const msgs = await client.getMessages({ limit });
  //for (let i=0; i<msgs.length; i++) {
  //  console.log(new DiscodMessageHelper(msgs[i]).prompt!.name);
  //}
  // await client.waitMessage({})
  // console.log(new DiscodMessageHelper(msgs[0]).prompt);
  // const { commandCache } = client;
  assertEquals(msgs.length, limit);
});
