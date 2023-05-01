# midjourney-discord-api

[![NPM Version](https://img.shields.io/npm/v/midjourney-discord-api.svg?style=flat)](https://www.npmjs.org/package/midjourney-discord-api)
_midjourney-discord-api_

`midjourney-discord-api` is a library designed to connect to a Discord channel
and send messages to be processed by the Midjourney bot. It utilizes the same
requests as the Discord web client, allowing seamless communication with the
bot. To configure the library, extract an authenticated request sent to the
Midjourney bot using your web development tools.

## Features

| feature     | Status | feature      | Status |
| ----------- | ------ | ------------ | ------ |
| `/ask`      | 🙈     | `/private`   | ❌ N/A |
| `/blend`    | 🚧 WIP | `/public`    | ❌ N/A |
| `/describe` | ✅     | `/relax`     | ✅     |
| `/fast`     | ✅     | `/settings`  | ✅     |
| `/help`     | 🙈     | `/show`      | ❌ N/A |
| `/imagine`  | ✅     | `/stealth`   | ❌ N/A |
| `/info`     | ❌ N/A | `/subscribe` | 🙈     |
| `/invite`   | 🙈     | `/prefer`    | ❌ N/A |
| `Upscale`   | ✅     | `Variations` | ✅     |
| `Reroll`    | ✅     |              |        |

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

- Open your webbrowser
- Go to your discord channel
- Open the developent bar
- Go to network
- Send a request to discordBot, like /settings
- Left click on the `https://discord.com/api/v9/interactions` request.
- Click `Copy`
- Click `Copy as fetch`
- Save this request in a file, that you will provide to the `Midjourney`
  constructor. (for my Test I name this file `interaction.txt`)

## Usage

Here are some examples of how to use the `Midjourney` class:

### Describe URL

```ts
import Midjourney from "midjourney-discord-api";

const client = new Midjourney("interaction.txt");
const prompts: string[] = await client.describeUrl(
  "https://cdn.midjourney.com/95e2c8fd-255c-4982-9065-83051143570c/0_0_640_N.webp",
);
console.log("reversed prompt: ", prompts);
```

### Imagine

```ts
import Midjourney from "midjourney-discord-api";

const client = new Midjourney("interaction.txt");
const msg = await client.imagine(
  "A photo of an astronaut riding a horse",
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
      const result = await msg.variant(i);
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
      const result = await msg.variant(i);
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
const msg = await client.imagine(
  "A photo of an astronaut riding a horse",
);
if (msg.canReroll()) {
  const result = msg.reroll();
  console.log(`upscale V2 Ready from`, result.attachments[0].url);
}
```

## API Documentation

Refer to the provided method signatures and samples in the original post for
detailed information on how to use each method and interface.

## Contributing

We welcome contributions to the midjourney-discord-api project. Please feel free
to submit issues, feature requests, and pull requests to improve the project.

## reference

- [Discord Snowflake to Timestamp Converter](https://snowsta.mp/)

## License

This project is licensed under the MIT License.
