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
    target.notify = this._runInContext.bind(
      this,
      target.notify.bind(target),
      target
    );
    return target;
  }

  runInTransaction(callback: Callback) {
    if (!this._transaction) {
      this._transaction = new Transaction();
      this._transaction.run(callback);
      this._transaction = undefined;
    } else {
      this._transaction.run(callback);
    }
  }

  protected _runInContext(callback: Callback, target: Target) {
    this._target = target;
    this.runInTransaction(callback);
    this._target = undefined;
  }
}
