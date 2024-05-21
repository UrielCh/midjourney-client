/**
 * Single direction linked queue Node
 */
interface Node<T> {
  value: T;
  next?: Node<T>;
}

/**
 * Queue like sindresorhus/yocto-queue with an extra enqueueFirst()
 */
export class Queue<T = unknown> implements Iterable<T> {
  #head?: Node<T>;
  #tail?: Node<T>;
  #size: number;

  constructor() {
    // do not call clear to avoid Typescript warnings
    this.#size = 0;
  }

  /**
   * add to the end of the queue.
   * @param values values to add to the end of the queue
   */
  public enqueue(...values: T[]): void {
    for (const value of values) {
      const node: Node<T> = { value };
      if (this.#head && this.#tail) {
        // replace the last Node
        this.#tail.next = node;
        this.#tail = node;
      } else {
        // the queue is empty
        this.#head = this.#tail = node;
      }
      this.#size += 1;
    }
  }

  /**
   * pretend the queue with a new Node.
   * @param values values to add to the front of the queue
   */
  public enqueueFirst(...values: T[]): void {
    for (const value of values) {
      if (this.#head && this.#tail) {
        const node: Node<T> = { value, next: this.#head };
        this.#head = node;
      } else {
        // the queue is empty
        this.#head = this.#tail = { value };
      }
      this.#size += 1;
    }
  }

  /**
   * remove the first Node from the queue.
   * @returns the value of the first Node or undefined if the queue is empty
   */
  public dequeue(): T | void {
    const current = this.#head;
    if (!current) {
      return;
    }
    this.#head = current.next;
    this.#size -= 1;
    return current.value;
  }

  /**
   * remove all Nodes from the queue.
   */
  public clear(): void {
    this.#head = undefined;
    this.#tail = undefined;
    this.#size = 0;
  }

  /**
   * the number of Nodes in the queue.
   */
  public get size(): number {
    return this.#size;
  }

  /**
   * the values of the Nodes in the queue.
   */
  *[Symbol.iterator](): Iterator<T, void, undefined> {
    let current = this.#head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
