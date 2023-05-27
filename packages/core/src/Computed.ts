import { Callback, Source } from "./types";
import { EvalContext } from "./EvalContext";

export class Computed<Value> implements Source<Value> {
  protected _isComputing = false;

  get value(): Value {
    if (this._isComputing) {
      throw "Cycle detected";
    }
    this._isComputing = true;
    const result = this._callback();
    this._isComputing = false;
    return result;
  }

  constructor(
    protected _callback: Callback<Value>,
    protected _context: EvalContext
  ) {}

  peek(): Value {
    return this._context.runOutOfContext<Value>(() => this.value);
  }
}
