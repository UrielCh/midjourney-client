import { assertEquals } from "../dev_deps.ts";
import Midjourney from "./Midjourney.ts";
import { KNOWN_METHODS } from "./CommandCache.ts";

Deno.test(async function LoadAllCmds() {
  const client = new Midjourney("interaction.txt");
  const { commandCache } = client;

  for (const mtd of KNOWN_METHODS) {
    const cmd = await commandCache.getCommand(mtd);
    assertEquals(cmd.name, mtd);
  }
});
