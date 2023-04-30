// deno-lint-ignore-file
import Midjourney from "./src/Midjourney.ts";
import { SnowflakeObj } from "./src/SnowflakeObj.ts";
import { logger } from "./deps.ts";

/**
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
async function imaginVariantUpscal(client: Midjourney, prompt: string) {
  // 5 second back in time
  const startId = new SnowflakeObj(-5 * 1000).encode();
  let msg = await client.waitMessage({
    prompt,
    startId,
    type: "grid",
    maxWait: 0,
  });
  if (!msg) {
    logger.info("Failed to find existing prompt result");
    msg = await client.imagine(prompt);
  }
  logger.info("Prompt result available", { id: msg.id });
  {
    const variant = msg.getComponents(false, "V");
    logger.info(`${variant.length} Variant can be generated`);
    if (variant.length > 0) {
      logger.info(`Generating Variant ${variant[0].label}`);
      const msg2 = await client.callCustomComponents(variant[0]);
      logger.info(`variant Ready from`, msg2.attachments[0].url);
    } else {
      logger.warn(
        `No move variant available in result label:`,
        msg.componentsSummery.map((a) => a.label).join(", "),
      );
    }
  }
  {
    const upscale = msg.getComponents(false, "U");
    logger.info(`${upscale.length} Upscale can be generated`);
    if (upscale.length > 0) {
      logger.info(`Generating upscale ${upscale[0].label}`);
      const msg2 = await client.callCustomComponents(upscale[0]);
      logger.info(`upscale Ready from`, msg2.attachments[0].url);
    } else {
      logger.warn(
        `No move upscale available in result label:`,
        msg.componentsSummery.map((a) => a.label).join(", "),
      );
    }
  }
  console.log("done");
}

async function mainSample() {
  // go to https://www.midjourney.com/app/feed/
  // pick some iamges URL
  // $$('img[data-job-id]').map(a => a.getAttribute('src'))
  try {
    const urls = [
      "https://cdn.midjourney.com/95e2c8fd-255c-4982-9065-83051143570c/0_0_640_N.webp",
      "https://cdn.midjourney.com/7decf47e-15ed-4e85-bb12-573d29db6643/0_1_640_N.webp",
      "https://cdn.midjourney.com/3fab7bb4-3835-40fb-b098-6f823b7cbfd1/0_1_640_N.webp",
      "https://cdn.midjourney.com/2e0fb027-9dce-4af2-9414-ef9eef3e048e/0_2_640_N.webp",
      "https://cdn.midjourney.com/9f659546-f918-4fd3-8df4-bbcaeb838613/0_3_640_N.webp",
      "https://cdn.midjourney.com/7ecc7b5c-7d81-4cf3-a678-ef090056ffb3/0_3_640_N.webp",
      "https://cdn.midjourney.com/c1611f22-8b2b-48e3-9f75-4ea6618be63e/0_3_640_N.webp",
      "https://cdn.midjourney.com/1035e6fe-ad91-45a2-8559-a2bee7b9a20b/0_0_640_N.webp",
      "https://cdn.midjourney.com/f96efdc6-3c4f-4ad5-bb1a-ceb36d32be25/0_1_640_N.webp",
      "https://cdn.midjourney.com/970941a8-f1a4-47b2-8561-1a6bfd15a119/0_3_640_N.webp",
      "https://cdn.midjourney.com/c15e7764-f059-457b-9b92-e1c618ee3079/0_2_640_N.webp",
      "https://cdn.midjourney.com/408921b2-f49f-4384-8e00-84b623d66e8c/0_2_640_N.webp",
      "https://cdn.midjourney.com/d0b36b36-dc8d-4a99-80a7-e24be609ba9f/0_0_640_N.webp",
      "https://cdn.midjourney.com/1dddb068-d241-4150-906a-c26c5186c005/0_3_640_N.webp",
      "https://cdn.midjourney.com/3460f114-07b8-46ca-9220-e305a11ae94d/0_2_640_N.webp",
      "https://cdn.midjourney.com/1d52dbe7-aa53-4874-a3e3-b01dd7b50976/0_0_640_N.webp",
      "https://cdn.midjourney.com/b6d13183-145e-4208-bbc4-822bc877f2e5/0_0_640_N.webp",
      "https://cdn.midjourney.com/9e3f8b4d-52e4-4f2a-9545-652e874a84c8/0_1_640_N.webp",
      "https://cdn.midjourney.com/6dcfbb61-0f43-4882-b204-1f601ae3c740/0_1_640_N.webp",
      "https://cdn.midjourney.com/f94237ec-d0d6-446c-9e71-7018b42dcffc/0_3_640_N.webp",
      "https://cdn.midjourney.com/ed799479-cb27-4898-bda8-6ccec1b9477e/0_2_640_N.webp",
      "https://cdn.midjourney.com/3c971d24-af7e-475b-b1f0-79b14b402a3c/0_0_640_N.webp",
      "https://cdn.midjourney.com/a850ddd7-ec04-426d-8457-de580c3be0cc/0_3_640_N.webp",
      "https://cdn.midjourney.com/6edcd5c3-4571-4bf8-815f-71ce4de0c4b2/0_1_640_N.webp",
      "https://cdn.midjourney.com/7110cabb-b85d-4eb6-b679-b182276a97ae/0_2_640_N.webp",
      "https://cdn.midjourney.com/ec43eaae-3939-4c2a-af17-c490db5cb0bb/0_3_640_N.webp",
      "https://cdn.midjourney.com/01976e5a-b4de-4abe-bead-c08c0dfa7195/0_0_640_N.webp",
      "https://cdn.midjourney.com/f3c4dd2e-ca12-442a-9578-93d3d314e501/0_0_640_N.webp",
      "https://cdn.midjourney.com/2a6294c0-501c-4e6c-a277-1bf248d55025/0_1_640_N.webp",
      "https://cdn.midjourney.com/f0d382a9-9598-4532-921f-964eaf048cb6/0_0_640_N.webp",
      "https://cdn.midjourney.com/54aa291c-d50e-4cc0-b441-e9d0d92f7830/0_3_640_N.webp",
      "https://cdn.midjourney.com/402f2a33-fda9-49a0-8a59-0b23f70c796a/0_0_640_N.webp",
      "https://cdn.midjourney.com/daa080d0-8e32-402f-a3bd-9d1125f2fd5b/0_3_640_N.webp",
      "https://cdn.midjourney.com/dfbf0449-a698-4c2c-b9bd-95a859e3e034/0_0_640_N.webp",
      "https://cdn.midjourney.com/f5d6b6bd-50b2-4c6e-acda-504b2c5a1579/0_3_640_N.webp",
      "https://cdn.midjourney.com/12674380-594d-40ab-a95b-c2655bf8787a/0_3_640_N.webp",
      "https://cdn.midjourney.com/e88950e3-f898-45e6-8184-fc3402a1d230/0_1_640_N.webp",
      "https://cdn.midjourney.com/034ea9e1-8e8c-4144-9264-ac69ea3e5bf3/0_3_640_N.webp",
      "https://cdn.midjourney.com/bbafb09b-99d4-4172-a976-b79e7219844f/0_2_640_N.webp",
      "https://cdn.midjourney.com/5e65d52f-8bce-4953-8793-e2af9c3808ae/0_3_640_N.webp",
    ];

    // let url = "";
    // url =
    //   "https://cdn.midjourney.com/c6052a4e-324e-4f15-8f93-79da700f9f21/0_0.webp";
    // url =
    //   "https://cdn.midjourney.com/5a2120ca-d9e1-46a5-9784-a7fb7026768e/0_3_32_N.webp";
    const client = new Midjourney("interaction.txt");
    // await client.connectDiscordBot();
    await client.fast();
    const msgs = await client.getMessages({ limit: 1 });

    console.log(msgs[0]);

    //const prompts = await client.describeUrl(urls[10]);
    //for (const prompt of prompts) {
    //  await imaginVariantUpscal(client, prompt);
    //}
  } catch (err) {
    console.error(err);
  }
}
if (import.meta.main) {
  mainSample();
}
