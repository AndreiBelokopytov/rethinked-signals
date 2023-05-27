import { Callback } from "./types";
import { Transaction } from "./Transaction";
import { Target } from "./Target";

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

  bind(callback: Callback) {
    const target = new Target(callback);
    const boundCallback = target.notify.bind(target);
    target.notify = () =>
      this.runInContext(() => this.runInTransaction(boundCallback), target);
    return target;
  }

  runInTransaction<Value>(callback: Callback<Value>) {
    if (!this._transaction) {
      this._transaction = new Transaction();
      this._transaction.run(callback);
      this._transaction = undefined;
    } else {
      this._transaction.run(callback);
    }
  }

  runInContext<Value>(callback: Callback<Value>, target: Target) {
    this._target = target;
    const result = callback();
    this._target = undefined;
    return result;
  }

  runOutOfContext<Value>(callback: Callback<Value>) {
    const target = this._target;
    this._target = undefined;
    const result = callback();
    this._target = target;
    return result;
  }
}
