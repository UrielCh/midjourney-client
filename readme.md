# Midjourney-Client

`midjourney-client` is a library designed to connect to a Discord channel and
send messages to be processed by the Midjourney bot. It utilizes the same
requests as the Discord web client, allowing seamless communication with the
bot. To configure the library, extract an authenticated request sent to the
Midjourney bot using your web development tools.

## Features

- Connects to a Discord channel
- Posts messages to be handled by the Midjourney bot
- Extracts necessary tokens from authenticated requests

## Installation

To add `midjourney-client` to your project, run:

```bash
npm install midjourney-client
```

## Usage

To use the library, follow these steps:

1. Extract an authenticated request sent to the Midjourney bot using your web
   development tools.
1. Save the request as a text file, e.g., request.txt.
1. Use the following code sample to send a prompt request to the Midjourney bot:

```typescript
import { Midjourney } from "midjourney-client";

const client = new Midjourney("request.txt");
const prompt =
  "Hall of a magnificent baroque palace filled with golden statues of skulls and paintings of skulls, beautiful staircase, Renaissance paintings, marble columns, high plants, large windows --ar 16:9 --s 1000";

await client.imagine(prompt);
await client.waitMessage(prompt);
```

## API

`Midjourney`

- constructor(requestFile: string): Initializes the Midjourney client with the
  provided request file.
- imagine(prompt: string): Sends a message to the Discord channel with the given
  prompt.
- waitMessage(prompt: string): Awaits the bot's response to the sent prompt.

## reference

- [Discord Snowflake to Timestamp Converter](https://snowsta.mp/)

## License

MIT License.
