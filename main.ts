import Midjourney from "./src/Midjourney.ts";
import { SnowflakeObj } from "./src/SnowflakeObj.ts";
import { logger } from "./deps.ts";
import { UploadSlot } from "./mod.ts";

async function download(
  url: string,
  filename: string,
): Promise<ArrayBufferLike> {
  try {
    const content: Uint8Array = await Deno.readFile(filename);
    return content.buffer;
  } catch (_e) {
    const data = await (await fetch(url)).arrayBuffer();
    logger.info("saving downloaded file to ", filename);
    Deno.writeFile(filename, new Uint8Array(data));
    return data;
  }
}

async function describeRegen() {
  const url =
    "https://cdn.midjourney.com/c6052a4e-324e-4f15-8f93-79da700f9f21/0_0.webp";
  const filename = "pixelSample.webp";
  const image = await download(url, filename);

  const client = new Midjourney("interaction.txt");
  const id = Date.now();
  const { attachments } = await client.attachments({
    filename,
    file_size: image.byteLength,
    id,
  });
  const [attachment] = attachments;
  await client.uploadImage(attachment, image, 'image/webp');
  await client.describe(attachment);
}

/**
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
async function imaginVariantUpscal() {
  const client = new Midjourney("interaction.txt");
  let prompt = "";
  prompt =
    "an ice cream cone with chocolate fudge coming out of it, in the style of rendered in cinema4d, dreamy symbolism, dimitry roulland, soft color blending, swirling vortexes, photo-realistic techniques, dotted";
  prompt = "the coast near a boat and a city, in the style of neogeo, richly detailed backgrounds, david welker, 32k uhd, detailed ship sails, arcadian landscapes, ps1 graphics --ar 51:91"
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
  try {
    // await describeRegen();
    await imaginVariantUpscal();
  } catch (err) {
    console.error(err);
  }
}
