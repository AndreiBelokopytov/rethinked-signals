import { EvalContext } from "./EvalContext";
import { Callback, Source, Target } from "./types";

export class Effect implements Target {
  #callback: Callback;
  #context: EvalContext;
  #isDisposed = false;
  #sources = new Set<Source<unknown>>();

  static create(callback: Callback) {
    const effect = new Effect(callback, EvalContext.default());
    effect.#run();
    return effect.dispose.bind(effect);
  }

  get isDisposed() {
    return this.#isDisposed;
  }

  constructor(callback: Callback, context: EvalContext) {
    this.#callback = callback;
    this.#context = context;
  }

  notify() {
    this.#run();
  }

  dispose(): void {
    this.#isDisposed = true;
  }

  addDependecy(source: Source<unknown>) {
    this.#sources.add(source);
  }

  hasDependency(source: Source<unknown>) {
    return this.#sources.has(source);
  }

  #run() {
    this.#context.enter(this);
    this.#sources = new Set();
    this.#callback();
    this.#context.exit();
  }
}