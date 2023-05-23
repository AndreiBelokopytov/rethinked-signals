import {Callback, Target} from "./types";
import {Transaction} from "./Transaction";

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

  runInContext(target: Target, callback: Callback) {
    this._target = target;
    if (!this._transaction) {
      this._transaction = new Transaction();
      this._transaction.run(callback);
      this._transaction = undefined;
    } else {
      this._transaction.run(callback);
    }
    this._target = undefined;
  }
}
