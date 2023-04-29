# midjourney-discord-api

`midjourney-discord-api` is a library designed to connect to a Discord channel
and send messages to be processed by the Midjourney bot. It utilizes the same
requests as the Discord web client, allowing seamless communication with the
bot. To configure the library, extract an authenticated request sent to the
Midjourney bot using your web development tools.

## Features

| feature     | Status             | feature     | Status             |
| ----------- | ------------------ | ----------- | ------------------ |
| `ask`       | :see_no_evil:      | `private`   | :x:                |
| `blend`     | :x:                | `public`    | :x:                |
| `describe`  | :white_check_mark: | `relax`     | :white_check_mark: |
| `fast`      | :white_check_mark: | `settings`  | :white_check_mark: |
| `help`      | :see_no_evil:      | `show`      | :x:                |
| `imagine`   | :white_check_mark: | `stealth`   | :x:                |
| `info`      | :x:                | `subscribe` | :see_no_evil:      |
| `invite`    | :see_no_evil:      | `prefer`    | :x:                |

## Installation

### NodeJS ESM or CJS

```sh
npm install midjourney-discord-api
```

### ESM nodeJS

```js
import Midjourney from "midjourney-discord-api";

const cli = new Midjourney('interaction.txt');
const msgs = await cli.getMessages();
console.log(msgs.length + ' messages visibles'); // by default get 50 messages
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
const msg: DiscordMessageHelper = await client.imagine(
  "A photo of an astronaut riding a horse",
);
console.log("you can your result here: ", msg.attachments[0].url);
```

### Upscale

```ts
import Midjourney from "midjourney-discord-api";

const client = new Midjourney("interaction.txt");
const msg: DiscordMessageHelper = await client.imagine(
  "A photo of an astronaut riding a horse",
);
// get all Upscale button
const upscale = msg.getComponents(false, "U");
console.log(`${upscale.length} Upscales can be generated`);
console.log(`Generating upscale ${upscale[0].label}`);
const msg2 = await client.callCustomComponents(upscale[0]);
console.log(`upscale Ready from`, msg2.attachments[0].url);
```

### Variant

```ts
import Midjourney from "midjourney-discord-api";

const client = new Midjourney("interaction.txt");
const msg: DiscordMessageHelper = await client.imagine(
  "A photo of an astronaut riding a horse",
);
// get all Upscale button
const variant = msg.getComponents(false, "V");
console.log(`${variant.length} Variants can be generated`);
console.log(`Generating Variant ${variant[0].label}`);
const msg2 = await client.callCustomComponents(variant[0]);
console.log(`variant Ready from`, msg2.attachments[0].url);
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
