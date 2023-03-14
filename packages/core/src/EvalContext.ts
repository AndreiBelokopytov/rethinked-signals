import { Transaction } from "./Transaction";
import { Callback, Target } from "./types";

let defaultContext: EvalContext;

export class EvalContext {
  protected _target?: Target;
  protected _transaction?: Transaction;

  static default() {
    if (!defaultContext) {
      defaultContext = new EvalContext();
    }
    return defaultContext;
  }

  get target() {
    return this._target;
  }
}
