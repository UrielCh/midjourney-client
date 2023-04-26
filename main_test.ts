import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts";
import Midjourney from "./src/Midjourney.ts";

Deno.test(function addTest() {
  const client = new Midjourney('interaction.txt');
  console.log(client);
  // assertEquals(add(2, 3), 5);
});
