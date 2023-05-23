import { EvalContext } from "./EvalContext";
import { Source, Target } from "./types";

export class Signal<Value> implements Source<Value> {
  protected _targets: Target[] = [];

  static create<Value>(value: Value) {
    return new Signal(value, EvalContext.default());
  }

  get value() {
    const target = this._context.target;
    if (target && !target.hasDependency(this)) {
      this._targets.push(target);
      target.addDependency(this);
    }
    return this._value;
  }

  set value(nextValue: Value) {
    this._value = nextValue;
    const notify = this._notifyTargets.bind(this, this._targets);
    this._targets = [];
    notify();
  }

  constructor(private _value: Value, protected _context: EvalContext) {}

  toString() {
    return String(this.value);
  }

  valueOf() {
    return this._value;
  }

  protected _notifyTargets(targets: Target[]) {
    for (const target of targets) {
      if (!target.isDisposed && target.hasDependency(this)) {
        target.notify();
      }
    }
  }
}
