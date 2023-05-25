import { Callback, Disposable, Source } from "./types";

export class Target implements Disposable {
  private _isDisposed = false;
  protected _sources = new Set<Source<unknown>>();

  get isDisposed() {
    return this._isDisposed;
  }

  constructor(protected _callback: Callback) {}

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

  protected _clearDependencies() {
    this._sources = new Set();
  }
}
