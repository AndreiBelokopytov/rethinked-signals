type LinkedList<T> = {
  head?: T;
  tail?: LinkedList<T>;
};

export class MutableLinkedList<T> {
  #head?: T;
  #tail?: LinkedList<T>;

  get head() {
    return this.#head;
  }

  get isEmpty() {
    return this.#head === undefined;
  }

  add(item: T) {
    const tail = this.#tail;
    this.#tail = {
      head: this.#head,
      tail,
    };
    this.#head = item;
  }

  [Symbol.iterator]() {
    let nextItem = this.#head;
    let tail = this.#tail;
    return {
      next(): { done: true } | { done: false; value: T } {
        if (!nextItem) {
          return { done: true };
        }
        const value = nextItem;
        nextItem = tail?.head;
        tail = tail?.tail;
        return { done: false, value };
      },
    };
  }
}
