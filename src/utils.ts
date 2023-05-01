import { logger } from "../deps.ts";

export const REROLL = "🔄";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function download(
  url: string,
  filename: string,
): Promise<ArrayBuffer> {
  const data = await (await fetch(url)).arrayBuffer();
  if (filename) {
    logger.info("saving downloaded file to ", filename);
    await Deno.writeFile(filename, new Uint8Array(data));
  }
  return data;
}

/**
 * download or read file from disk
 */
export async function downloadFileCached(
  url: string,
  filename: string,
): Promise<ArrayBufferLike> {
  try {
    const content: Uint8Array = await Deno.readFile(filename);
    return content.buffer;
  } catch (_e) {
    return download(url, filename);
  }
}

export function getExistinggroup(text: string, reg: RegExp): string {
  const m = text.match(reg);
  if (!m) {
    throw Error(
      `failed to find ${reg} in provided sample of size:${text.length}`,
    );
  }
  return m[1];
}

export function filename2Mime(filename: string): string {
  filename = filename.toLowerCase();
  if (filename.endsWith(".webp")) {
    return "image/webp";
  } else if (filename.endsWith(".jpeg")) {
    return "image/jpeg";
  } else if (filename.endsWith(".jpg")) {
    return "image/jpeg";
  } else if (filename.endsWith(".png")) {
    return "image/png";
  } else {
    throw Error(`unknown extention in ${filename}`);
  }
}
