import Writable from "./writable.ts";
import { exists } from "./fs.ts";
import { WriterConstructor, WriterWrite } from "./interface.ts";
import Types from "./types.ts";

export default class Writer {
  private maxBytes?: number;
  private maxBackupCount?: number;
  private pathWriterMap = new Map();

  private [Types.INFO]: string = "";
  private [Types.WARN]: string = "";
  private [Types.ERROR]: string = "";

  constructor({ maxBytes, maxBackupCount }: WriterConstructor) {
    if (maxBytes !== undefined && maxBytes <= 0) {
      throw new Error("maxBytes cannot be less than 1");
    }
    this.maxBytes = maxBytes;

    if (maxBackupCount === undefined) return;
    if (!maxBytes) {
      throw new Error("maxBackupCount must work with maxBytes");
    }
    if (maxBackupCount <= 0) {
      throw new Error("maxBackupCount cannot be less than 1");
    }
    this.maxBackupCount = maxBackupCount;
  }

  private async newWriter(path: string) {
    const writer = new Writable(path);
    await writer.setup();
    this.pathWriterMap.set(path, writer);
    return writer;
  }

  async write({ path, msg, type }: WriterWrite): Promise<void> {
    const msgByteLength = msg.byteLength;

    if (this.pathWriterMap.has(path)) {
      const writer = this.pathWriterMap.get(path);
      const currentSize = writer.currentSize;
      const size = currentSize + msgByteLength;
      if (this.maxBytes && size > this.maxBytes) {
        writer.close();
        this.rotateLogFiles(path);
        const _writer = await this.newWriter(path);
        await _writer.write(msg);
      } else {
        await writer.write(msg);
      }
      return;
    }

    const typePath = this[type];
    if (typePath) {
      const pathWriter = this.pathWriterMap.get(typePath);
      if (pathWriter && pathWriter.close) pathWriter.close();
      this.pathWriterMap.delete(typePath);
    }
    this[type] = path;

    const writer = await this.newWriter(path);
    await writer.write(msg);
  }

  async rotateLogFiles(path: string): Promise<void> {
    if (this.maxBackupCount) {
      for (let i = this.maxBackupCount - 1; i >= 0; i--) {
        const source = path + (i === 0 ? "" : "." + i);
        const dest = path + "." + (i + 1);
        const exist = await exists(source);
        if (exist) {
          await Deno.rename(source, dest);
        }
      }
    } else {
      const dest = path + "." + Date.now();
      await Deno.rename(path, dest);
    }
  }
}
