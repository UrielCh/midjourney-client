import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts";
import Midjourney from "./src/Midjourney.ts";

Deno.test(async function addTest() {
  const client = new Midjourney('interaction.txt');
  // console.log(client);
  const msg = await client.getMessages({limit: 1});
  // 
  // console.log(msg);
  // assertEquals(add(2, 3), 5);
});
