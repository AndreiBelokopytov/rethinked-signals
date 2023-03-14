import { Callback } from "./types";

export class Transaction {
  #body?: Set<Callback>;

  get isRunning() {
    return Boolean(this.#body);
  }

  run(callback: Callback) {
    if (this.isRunning) {
      this.#body!.add(callback);
    } else {
      this.#body = new Set();
      callback();
      for (const instruction of this.#body) {
        instruction();
      }
      this.#body = undefined;
    }
  }
}
