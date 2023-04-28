// deno-lint-ignore-file
import Midjourney from "./src/Midjourney.ts";
import { SnowflakeObj } from "./src/SnowflakeObj.ts";
import { logger } from "./deps.ts";

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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function describe(imageUrl: string) {
  const url = new URL(imageUrl);
  const filename = url.pathname.replaceAll(/\//g, '_');// "pixelSample.webp";
  let contentType = '';
  if (filename.endsWith('.webp'))
    contentType = 'image/webp';
  else if (filename.endsWith('.jpeg'))
    contentType = 'image/jpeg';
  else if (filename.endsWith('.jpg'))
    contentType = 'image/jpeg';
  else if (filename.endsWith('.png'))
    contentType = 'image/png';
  else {
    throw Error(`unknown extention in ${filename}`);
  }
  const image = await download(imageUrl, filename);

  const client = new Midjourney("interaction.txt");
  const id = Date.now();
  const { attachments } = await client.attachments({
    filename,
    file_size: image.byteLength,
    id,
  });
  const [attachment] = attachments;
  await client.uploadImage(attachment, image, contentType);
  await client.describe(attachment);
  const [ msg ] = await client.getMessages({limit: 1});
  await wait(1000);
  console.log(msg);
  await wait(3000);
  console.log('-----');
  console.log(msg);
  await wait(10000);
  console.log('-----');
  console.log(msg);
}

/**
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
async function imaginVariantUpscal(prompt: string) {
  const client = new Midjourney("interaction.txt");
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
      logger.info(`variant Ready from`, msg2?.attachments[0].url);
    } else {
      logger.warn(
        `No move variant available in result label:`,
        msg.components.map((a) => a.label).join(", "),
      );
    }
  }
  {
    const upscale = msg.getComponents(false, "U");
    logger.info(`${upscale.length} Upscale can be generated`);
    if (upscale.length > 0) {
      logger.info(`Generating Variant ${upscale[0].label}`);
      await client.callCustom2(upscale[0]); // ex: MJ::JOB::variation::1::12345678-abcd-1234-1234-1234567890ab
      logger.info(`Waiting result to be issued`);
      const msg2 = await client.waitComponents(upscale[0]); // {prompt, imgId: variant[0].label, type: "variations"}
      logger.info(`upscale Ready from`, msg2?.attachments[0].url);
    } else {
      logger.warn(
        `No move upscale available in result label:`,
        msg.components.map((a) => a.label).join(", "),
      );
    }
  }
  console.log("done");
}

if (import.meta.main) {
  try {
    let url = '';
    url = "https://cdn.midjourney.com/c6052a4e-324e-4f15-8f93-79da700f9f21/0_0.webp";
    url = "https://cdn.midjourney.com/5a2120ca-d9e1-46a5-9784-a7fb7026768e/0_3_32_N.webp";
    await describe(url);
    // await imaginVariantUpscal();
  } catch (err) {
    console.error(err);
  }
}
