// Learn more at https://deno.land/manual/examples/module_metadata#concepts
// import { load } from "https://deno.land/std@0.184.0/dotenv/mod.ts";
import "https://deno.land/std@0.184.0/dotenv/load.ts";


import Midjourney from './src/Midjourney.ts';
import { DiscodMessageHelper } from "./src/models.ts";
/**
 * 
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
async function main() {
  const client = new Midjourney('interaction.txt');
  // console.log(client);
  // await client.settings();
  // await client.setSettingsFast();
  // const prompt = "Hall of a magnificent baroque palace filled with golden statues of skulls and paintings of skulls, beautiful staircase, Renaissance paintings, marble columns, high plants, large windows --ar 16:9 --s 1000";
  // await client.imagine(prompt);
  // await client.WaitMessage(prompt);
  const msgs = await client.retrieveMessages({ limit: 10 });
  const msgs2 = msgs.map((m) => new DiscodMessageHelper(m));

  for (const msg of msgs2) {
    if (msg && msg.isImagineResult()) {
      const todo = msg.getComponents(false, 'V4');
      if (todo.length > 0) {
        console.log(todo[0].custom_id);
        break;
        // await client.callCustom2(todo[0]);
      }
    }
  }
  // console.log(JSON.stringify(msg2, null, 2));
  // const msg = await client.SettingsApi();
  // SettingsApi
  // const msg = await client.Imagine("A little pink elephant", (uri: string) => {
  //     console.log("loading", uri)
  // })
  //  console.log({ msg })
}
if (import.meta.main) {

  main().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}