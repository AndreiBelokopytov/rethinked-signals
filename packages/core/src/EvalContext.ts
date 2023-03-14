import { Transaction } from "./Transaction";
import { Callback, Target } from "./types";

let defaultContext: EvalContext;

export class EvalContext {
  #target?: Target;
  #transaction?: Transaction;

  static default() {
    if (!defaultContext) {
      defaultContext = new EvalContext();
    }
    return defaultContext;
  }

  get target() {
    return this.#target;
  }

  run(target: Target, callback: Callback) {
    this.#target = target;
    if (!this.#transaction) {
      this.#transaction = new Transaction();
      this.#transaction.run(callback);
      this.#transaction = undefined;
    } else {
      this.#transaction.run(callback);
    }
    this.#target = undefined;
  }
}
