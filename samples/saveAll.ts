import { MIDJOURNEY_CHANNELS, Midjourney, SnowflakeObj } from "../mod.ts";
import { pc } from "../deps.ts";
import nativebird from "npm:nativebird";


async function downloadChannnel(url: `https://discord.com/channels/${number}/${number}`, toDownload=2000) {
  const client = new Midjourney("interaction.txt");
  let dateEnd = new SnowflakeObj();
  const limit = 100;
  client.setDiscordChannelUrl(url);
  const destFolder = `images/${client.guild_id}/${client.channel_id}`;
  await Deno.mkdir(destFolder, { recursive: true });
  let nbMessage = 0;
  const fd = await Deno.open(`${destFolder}/index.txt`, {
    append: true,
    create: true,
  });
  while (nbMessage < toDownload) {
    const before = dateEnd.encode();
    const msgs = await client.getMessages({ limit, before });

    await nativebird.map(
      msgs,
      async (msg) => {
        const nbAtt = msg.attachments.length;
        for (let attachementId = 0; attachementId < nbAtt; attachementId++) {
          const dest = `${destFolder}/${msg.parentInteraction}`;
          const result = await msg.download(attachementId, dest);
          if (result && !result.cached) {
            const date = new SnowflakeObj(msg.id).date;
            await fd.write(
              new TextEncoder().encode(
                `${date.toISOString()}\t${msg.id}\t${
                  result.file
                }\t${msg.componentsNames.join(",")}\t${msg.content.replaceAll(
                  /[\r\n\t]+/g,
                  " "
                )}\n`
              )
            );
          }
        }
      },
      { concurrency: 5 }
    );

    if (msgs.length < limit) {
      console.log(pc.yellow("no more message to get"));
      break;
    }
    nbMessage += msgs.length;
    dateEnd = new SnowflakeObj(msgs[msgs.length - 1].id);
  }
  fd.close();
  console.log(
    `Done ${pc.green("" + nbMessage)}/${pc.green("" + toDownload)} downloaded`
  );
}

const p2 = downloadChannnel(MIDJOURNEY_CHANNELS.general2);
const p3 = downloadChannnel(MIDJOURNEY_CHANNELS.general3);
const p4 = downloadChannnel(MIDJOURNEY_CHANNELS.general4);
const p5 = downloadChannnel(MIDJOURNEY_CHANNELS.general5);

await Promise.all([p2, p3, p4, p5]);
