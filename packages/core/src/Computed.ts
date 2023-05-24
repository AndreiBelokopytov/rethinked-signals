import { ComputedFn, Source } from "./types";
import { Signal } from "./Signal";
import { EvalContext } from "./EvalContext";

export class Computed<Value> implements Source<Value> {
  static create<Value>(computedFn: ComputedFn<Value>) {
    return new Computed(computedFn);
  }

  get value(): Value {
    return this._computedFn();
  }

  constructor(private _computedFn: ComputedFn<Value>) {}
}
