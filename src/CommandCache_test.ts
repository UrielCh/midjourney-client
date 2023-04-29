import { assertEquals } from "../dev_deps.ts";
/// import { KNOWN_METHODS } from "./CommandCache.ts";
import { getMidjourney } from "./Midjourney_test.ts";
import { wait } from "./utils.ts";

Deno.test(async function LoadAllCmds() {
  const client = getMidjourney();
  const { commandCache } = client;

  for (const mtd of ["describe"] as const) { // KNOWN_METHODS
    await wait(1000);
    const cmd = await commandCache.getCommand(mtd);
    assertEquals(cmd.name, mtd);
  }
});
