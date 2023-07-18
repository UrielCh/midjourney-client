# midjourney-discord-api

[![NPM Version](https://img.shields.io/npm/v/midjourney-discord-api.svg?style=flat)](https://www.npmjs.org/package/midjourney-discord-api)
_midjourney-discord-api_

[Deno doc](https://deno.land/x/midjourney_discord_api)

`midjourney-discord-api` is a library designed to connect to a Discord channel
and send messages to be processed by the Midjourney bot. It utilizes the same
requests as the Discord web client, allowing seamless communication with the
bot. To configure the library, extract an authenticated request sent to the
Midjourney bot using your web development tools.

## Features

| feature     | Status | feature      | Status |
| ----------- | ------ | ------------ | ------ |
| `/blend`    | ✅     | `Reroll`    | ✅     |
| `/describe` | ✅     | `/relax`     | ✅     |
| `/fast`     | ✅     | `/settings`  | ✅     |
| `/imagine`  | ✅     | `Variations` | ✅     |
| `Upscale`   | ✅     | `concurent calls`| ✅ |
| `/private`  | ❌ N/A | `/public`    | ❌ N/A |
| `/show`      | ❌ N/A |`/stealth`   | ❌ N/A |

## Installation

### NodeJS ESM or CJS

```sh
npm install midjourney-discord-api
```

### ESM nodeJS

```js
import Midjourney from "midjourney-discord-api";

const cli = new Midjourney("interaction.txt");
const msgs = await cli.getMessages();
console.log(msgs.length + " messages visibles"); // by default get 50 messages
```

### Deno

```ts
import Midjourney from "https://deno.land/x/midjourney_discord_api/mod.ts";
```

## Token / ids extraction.

- Open your web browser to [https://discord.com/channels/@me](https://discord.com/channels/@me)
- Click in the discord channel you want to work into like [https://discord.com/channels/662267976984297473/933565701162168371](https://discord.com/channels/662267976984297473/933565701162168371)
- Open the developent bar (on chrome: `F12` on windows `Command ⌘` + `Option ⌥` + `I` on mac)
- Go to network

![Go to network](https://github.com/UrielCh/midjourney-client/blob/main/doc/chrome-network.png?raw=true "Go to network")
- Send a request to discordBot, like /settings
- Left click on the `https://discord.com/api/v9/interactions` request or `https://discord.com/api/v9/science`.
- Click `Copy`
- Click `Copy as fetch`

![Copy as fetch](https://github.com/UrielCh/midjourney-client/blob/main/doc/copy-as-fetch.png?raw=true "Copy as fetch")
- Save this request in a file, that you will provide to the `Midjourney`
  constructor. (for my Test I name this file `interaction.txt`)

## Midjourney client initialization

the Midjourney client can be initilized in 4 different ways:

### new Midjourney(filename) *fetch command*

in this case the provided file should contains a valid NodeJS fetch command as described in the previous section.

`filename` can also be replace by it's content.

### new Midjourney(filename) *environement file*

in this case the provided file should contains somthink like:
```ini
SALAI_TOKEN = your 72 char long authorization token
SERVER_ID = the serverId
CHANNEL_ID = the channelId
```
`SERVER_ID` and `CHANNEL_ID` can be omit, if you provide those data using `Midjourney.setDiscordChannelUrl("https://discord.com/channels/1234567890/1234567890")`

### environement variable

in this case `SALAI_TOKEN` should contains you 72 char long authorization token.
`SERVER_ID` and `CHANNEL_ID`  should contains the serverId and channelId

`SERVER_ID` and `CHANNEL_ID` can be omit, if you provide those data using `Midjourney.setDiscordChannelUrl("https://discord.com/channels/1234567890/1234567890")`

### new Midjourney(SALAI_TOKEN) *directly provide SALAI_TOKEN*

in this case a 72 char long `SALAI_TOKEN` token should be pass to the `Midjourney` constructor like: `new Midjourney(SALAI_TOKEN)`

then you will have to provide serverId and channelId using `Midjourney.setDiscordChannelUrl("https://discord.com/channels/1234567890/1234567890")`

## Usage

Here are some examples of how to use the `Midjourney` class:

### Describe URL

```ts
import Midjourney from "midjourney-discord-api";

const client = new Midjourney("interaction.txt");
await client.connectWs(); // Used Websocket to boost detection. (experiental)
const prompts: string[] = await client.describeUrl(
  "https://cdn.midjourney.com/95e2c8fd-255c-4982-9065-83051143570c/0_0_640_N.webp",
  /* add optional progress function (percent) => void*/
);
console.log("reversed prompt: ", prompts);
```

### Imagine

```ts
import Midjourney from "midjourney-discord-api";

const client = new Midjourney("interaction.txt");
await client.connectWs(); // Used Websocket to boost detection. (experiental)
const msg = await client.imagine(
  "A photo of an astronaut riding a horse", 
  /* add optional progress function (percent) => void */
);
console.log("you find your result here: ", msg.attachments[0].url);
```

### Upscale

```ts
/**
 * Upscale the first none upscaled images in chat, searching from the newest to the oldest images
 */
import Midjourney from "midjourney-discord-api";

/**
 * Variant the last image available in chat
 */
const client = new Midjourney("interaction.txt");
await client.connectWs(); // Used Websocket to boost detection. (experiental)
const msgs = await client.getMessages();
main:
for (const msg of msgs) {
  if (!msg.canVariant()) {
    continue;
  }
  for (let i = 1; i <= 4; i++) {
    const v = msg.canVariant(i)
    if (v) {
      console.log(`Variant image ${v.custom_id} from ${msg.id}: ${msg.prompt?.prompt}`);
      const result = await msg.variant(i /* , add optional progress function (percent) => void */);
      await result.download(0, "images");
      break main;
    }
  }
}
```

### Variant

```ts
/**
 * Variant the last image available in chat
 */
const client = new Midjourney("interaction.txt");
await client.connectWs(); // Used Websocket to boost detection. (experiental)
const msgs = await client.getMessages();
main:
for (const msg of msgs) {
  if (!msg.canVariant()) {
    continue;
  }
  for (let i = 1; i <= 4; i++) {
    const v = msg.canVariant(i)
    if (v) {
      console.log(`Variant image ${v.custom_id} from ${msg.id}: ${msg.prompt?.prompt}`);
      const result = await msg.variant(i/* , add optional progress function (percent) => void */);
      await result.download(0, "images");
      break main;
    }
  }
}
```

### Reroll

```ts
import Midjourney from "midjourney-discord-api";

const client = new Midjourney("interaction.txt");
await client.connectWs(); // Used Websocket to boost detection. (experiental)
const msg = await client.imagine(
  "A photo of an astronaut riding a horse",
  /* add optional progress function (percent) => void */
);
if (msg.canReroll()) {
  const result = msg.reroll(/* add optional progress function (percent) => void */);
  console.log(`upscale V2 Ready from`, result.attachments[0].url);
}
```

## More Samples

check all the samples [here](https://github.com/UrielCh/midjourney-client/tree/main/samples)

| name                                                                                                            |  function                                           |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [ImagineSet.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/ImagineSet.ts)                   | Call concurent /imagine function at the same time   |
| [blendImages.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/blendImages.ts)                 | blend 2 random images                               |
| [describeRegen.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/describeRegen.ts)             | descript an image then imagine the returned prompts |
| [listLastMsgs.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/listLastMsgs.ts)               | list last message                                   |
| [parseOne.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/parseOne.ts)                       | debug one message                                   |
| [progressLogger.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/progressLogger.ts)           | a progress logger provider                          |
| [sampleUrls.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/sampleUrls.ts)                   | samples Image url used in test script               |
| [saveAll.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/saveAll.ts)                         | download all image from a channel                   |
| [upscaleLast.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/upscaleLast.ts)                 | upscall the last non upscalled image                |
| [upscaleLasthoursAgo.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/upscaleLasthoursAgo.ts) | upscall an image at a specific time                 |
| [variantLast.ts](https://github.com/UrielCh/midjourney-client/blob/main/samples/variantLast.ts)                 | generate variante for a the last generated image    |

## Contributing

We welcome contributions to the midjourney-discord-api project. Please feel free
to submit issues, feature requests, and pull requests to improve the project.

## reference

- [Discord Snowflake to Timestamp Converter](https://snowsta.mp/)

## License

This project is licensed under the MIT License.
