import { assertEquals } from "../dev_deps.ts";
import { KNOWN_METHODS } from "./CommandCache.ts";
import { getMidjourney } from "./Midjourney_test.ts";

Deno.test(async function LoadAllCmds() {
  const client = getMidjourney();
  const { commandCache } = client;

  for (const mtd of KNOWN_METHODS) {
    const cmd = await commandCache.getCommand(mtd);
    assertEquals(cmd.name, mtd);
  }
});
