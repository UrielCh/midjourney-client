import Types from "./types.ts";

export interface WriterConstructor {
  maxBytes?: number;
  maxBackupCount?: number;
}

export interface WriterWrite {
  path: string;
  msg: Uint8Array;
  type: Types;
}

export interface fileLoggerOptions extends WriterConstructor {
  rotate?: boolean;
  now?: boolean;
}

export interface LoggerWriteOptions {
  dir: string;
  type: Types;
  args: unknown[];
}
