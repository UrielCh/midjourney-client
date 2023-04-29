const { lstat } = Deno;
// import { access, constants } from 'node:fs/promises';

export async function exists(filePath: string): Promise<boolean> {
  // try {
  //   await access(filePath, constants.R_OK | constants.W_OK);
  //   return true;
  // } catch {
  //   return false;
  // }
  try {
    await lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
