import { EvalContext } from "./EvalContext";
import { Transaction } from "./Transaction";
import { Callback, Source, Target } from "./types";

export class Effect implements Target {
  protected _isDisposed = false;
  protected _target?: Target;
  protected _transaction?: Transaction;
  protected _callback: Callback;
  protected _sources = new Set<Source<unknown>>();

  static create(callback: Callback) {
    const effect = new Effect(callback, EvalContext.default());
    effect.notify();
    return effect.dispose.bind(effect);
  }

  get isDisposed() {
    return this._isDisposed;
  }

  constructor(callback: Callback, context: EvalContext) {
    this._callback = this._run.bind(context, this, callback);
  }

  notify() {
    this._clearDependencies();
    this._callback();
  }

  dispose(): void {
    this._isDisposed = true;
  }

  addDependency(source: Source<unknown>) {
    this._sources.add(source);
  }

  hasDependency(source: Source<unknown>) {
    return this._sources.has(source);
  }

  protected _run(target: Target, callback: Callback) {
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

  protected _clearDependencies() {
    this._sources = new Set();
  }
}
