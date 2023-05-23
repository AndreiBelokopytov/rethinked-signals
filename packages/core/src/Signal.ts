import { EvalContext } from "./EvalContext";
import { MutableLinkedList } from "./utils";
import { Source, Target } from "./types";

export class Signal<Value> implements Source<Value> {
  _targets = new MutableLinkedList<Target>();

  static create<Value>(value: Value) {
    return new Signal(value, EvalContext.default());
  }

  get value() {
    const target = this._context.target;
    if (target && !target.hasDependency(this)) {
      this._targets.add(target);
      target.addDependency(this);
    }
    return this._value;
  }

  set value(nextValue: Value) {
    this._value = nextValue;
    this._targets = this._notifyTargets();
  }

  constructor(private _value: Value, protected _context: EvalContext) {}

  toString() {
    return String(this.value);
  }

  valueOf() {
    return this._value;
  }

  protected _notifyTargets() {
    const activeTargets = new MutableLinkedList<Target>();
    for (const target of this._targets) {
      if (!target.isDisposed && target.hasDependency(this)) {
        activeTargets.add(target);
        target.notify();
      }
    }
    return activeTargets;
  }
}
