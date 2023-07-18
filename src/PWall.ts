import { Queue } from "./Queue.ts";

/**
 * Rate limiter for the API
 */
export class PWall {
  #intervalMs: number;
  #next: ReturnType<typeof setTimeout> | undefined;
  #queue: Queue<(value: void | PromiseLike<void>) => void>;

  constructor(intervalMs: number) {
    this.#intervalMs = intervalMs;
    this.#queue = new Queue<(value: void | PromiseLike<void>) => void>();
  }

  waitForAccess(): Promise<void> {
    if (!this.#next) {
      this.#next = setTimeout(this.releaseNext, this.#intervalMs);
      return Promise.resolve();
    }
    let resolve: (value: void | PromiseLike<void>) => void;
    const p = new Promise<void>((r) => resolve = r);
    this.#queue.enqueue(resolve!);
    return p;
  }

  private releaseNext = () => {
    const r = this.#queue.dequeue();
    if (r) {
      r();
    }
    if (this.#queue.size) {
      this.#next = setTimeout(this.releaseNext, this.#intervalMs);
    } else {
      this.#next = undefined;
    }
  };

  get intervalMs(): number {
    return this.#intervalMs;
  }
}
