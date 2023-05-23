import { EvalContext } from "./EvalContext";
import { Transaction } from "./Transaction";
import { Callback, Source, Target } from "./types";

export class Effect implements Target {
  protected _isDisposed = false;
  protected _sources = new Set<Source<unknown>>();

  static create(callback: Callback) {
    const effect = new Effect(callback, EvalContext.default());
    effect.notify();
    return effect.dispose.bind(effect);
  }

  get isDisposed() {
    return this._isDisposed;
  }

  constructor(protected _callback: Callback, protected _context: EvalContext) {}

  notify() {
    this._clearDependencies();
    this._context.runInContext(this, this._callback);
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

  protected _clearDependencies() {
    this._sources = new Set();
  }
}
