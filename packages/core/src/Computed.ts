import { ComputedFn, Source } from "./types";

export class Computed<Value> implements Source<Value> {
  get value(): Value {
    return this._computedFn();
  }

  constructor(private _computedFn: ComputedFn<Value>) {}
}

export function createComputed<Value>(computedFn: ComputedFn<Value>) {
  return new Computed(computedFn);
}
