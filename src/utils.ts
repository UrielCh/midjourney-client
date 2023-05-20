import { logger } from "../deps.ts";

export const REROLL = "🔄";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function download(
  url: string,
  filename: string,
): Promise<{ data: ArrayBufferLike; file: string }> {
  const data = await (await fetch(url)).arrayBuffer();
  if (filename) {
    logger.info(`saving downloaded file to ${filename}`);
    await Deno.writeFile(filename, new Uint8Array(data));
  }
  return { data, file: filename };
}

/**
 * download or read file from disk
 */
export async function downloadFileCached(
  url: string,
  filename: string,
): Promise<{ data: ArrayBufferLike; file: string; cached: boolean }> {
  try {
    const content: Uint8Array = await Deno.readFile(filename);
    return { data: content.buffer, file: filename, cached: true };
  } catch (_e) {
    return { ...await download(url, filename), cached: false };
  }
}

export function getExistinggroup(text: string, fallback_env: string, ...regs: RegExp[]): string {
  for (const reg of regs) {
    const m = text.match(reg);
    if (m) return m[1];
  }
  if (fallback_env) {
    const envData = Deno.env.get(fallback_env);
    if (envData) {
      return envData;
    }
  }
  const extra = fallback_env ? ` or fill the env variable: "${fallback_env}"` : "";
  throw Error(
    `failed to find ${regs.join(" | ")} in provided sample of size:${text.length}${extra}`,
  );
}

export function filename2Mime(filename: string): string {
  filename = filename.toLowerCase();
  if (filename.endsWith(".webp")) {
    return "image/webp";
  } else if (filename.endsWith(".jpeg") || filename.endsWith(".jpg")) {
    return "image/jpeg";
  } else if (filename.endsWith(".png")) {
    return "image/png";
  } else {
    throw Error(`unknown extention in ${filename}`);
  }
}
export function generateRandomString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
