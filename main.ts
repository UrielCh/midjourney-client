import Midjourney from "./src/Midjourney.ts";
import { SnowflakeObj } from "./src/SnowflakeObj.ts";
import { logger } from "./deps.ts";

/**
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
async function main() {
  const client = new Midjourney("interaction.txt");
  let prompt = "";
  prompt =
    "an ice cream cone with chocolate fudge coming out of it, in the style of rendered in cinema4d, dreamy symbolism, dimitry roulland, soft color blending, swirling vortexes, photo-realistic techniques, dotted";
  // prompt = "ice creams in clouds with an ice cream with chocolate shavings, yum, in the style of rendered in cinema4d, photo-realistic techniques, pinkcore, organic forms blending with geometric shapes, dotted, smooth curves, minimalist backgrounds";
  // prompt = "a man in a superman costume falling out of the sky, in the style of fisheye lens, lo-fi aesthetics, zack snyder, strong facial expression, space art, captivating gaze, andrzej sykut --ar 2:3";
  // prompt = "a person with glasses wearing a blue shirt, in the style of circular shapes, womancore, grandparentcore, light white and light bronze, photo taken with provia, portrait, nonrepresentational --ar 70:69";
  // prompt = "superman takes a selfie while flying in space, in the style of intense portraiture, environmental portraiture --ar 2:3";
  // prompt = "superman in space taking a selfie, in the style of environmental portraiture, high-angle --ar 2:3"
  // prompt =
  //   "person's profile on the website, in the style of barbara stauffacher solomon, sky-blue and navy, grandparentcore, photo taken with provia, jeannette guichard-bunel, optical, tondo --ar 70:69";
  // await client.setSettingsFast();
  // await client.setSettingsRelax();
  // await client.imagine(prompt);
  //   console.log("-=-=-=-=-=-=-=-");
  // 5 second back in time
  const startId = new SnowflakeObj(-3 * 60 * 60 * 1000).encode();
  let msg = await client.waitMessage({
    prompt,
    startId,
    type: "grid",
    maxWait: 0,
  });
  if (!msg) {
    logger.info("Failed to find existing prompt result");
    await client.imagine(prompt);
    msg = await client.waitMessageOrThrow({
      prompt,
      startId,
      maxWait: 3000,
    });
  }
  logger.info("Prompt result available", { id: msg.id });
  {
    const variant = msg.getComponents(false, "V");
    logger.info(`${variant.length} Variant can be generated`);
    if (variant.length > 0) {
      logger.info(`Generating Variant ${variant[0].label}`);
      await client.callCustom2(variant[0]); // ex: MJ::JOB::variation::1::12345678-abcd-1234-1234-1234567890ab
      logger.info(`Waiting result to be issued`);
      const msg2 = await client.waitComponents(variant[0]); // {prompt, imgId: variant[0].label, type: "variations"}
      logger.info(`variant Ready from`, msg2?.attachments[0]);
    } else {
      logger.warn(
        `No move variant available in result label:`,
        msg.components.map((a) => a.label).join(", "),
      );
    }
  }
  {
    const upscale = msg.getComponents(false, "U");
    logger.info(`${upscale.length} Variant can be generated`);
    if (upscale.length > 0) {
      logger.info(`Generating Variant ${upscale[0].label}`);
      await client.callCustom2(upscale[0]); // ex: MJ::JOB::variation::1::12345678-abcd-1234-1234-1234567890ab
      logger.info(`Waiting result to be issued`);
      const msg2 = await client.waitComponents(upscale[0]); // {prompt, imgId: variant[0].label, type: "variations"}
      logger.info(`variant Ready from`, msg2?.attachments[0]);
    } else {
      logger.warn(
        `No move variant available in result label:`,
        msg.components.map((a) => a.label).join(", "),
      );
    }
  }

  console.log("done");
}
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}
