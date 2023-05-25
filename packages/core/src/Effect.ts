import { EvalContext } from "./EvalContext";
import { Callback, Disposable } from "./types";
import { Target } from "./Target";

export class Effect implements Disposable {
  protected _target: Target;

  get isDisposed() {
    return this._target.isDisposed;
  }

  constructor(protected _callback: Callback, _context: EvalContext) {
    this._target = _context.bind(_callback);
  }

  run() {
    this._target.notify();
  }

  dispose() {
    this._target.dispose();
  }
}
