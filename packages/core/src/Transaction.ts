import { Callback } from "./types";

export class Transaction {
  protected _body?: Set<Callback>;

  get isRunning() {
    return Boolean(this._body);
  }

  run(callback: Callback) {
    if (this.isRunning) {
      this._body!.add(callback);
    } else {
      this._body = new Set();
      const result = callback();
      for (const instruction of this._body) {
        instruction();
      }
      this._body = undefined;
      return result;
    }
  }
}
