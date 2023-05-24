export interface Disposable {
  isDisposed: boolean;
  dispose(): void;
}

export type Callback = () => unknown;

export type ComputedFn<Value> = () => Value;

export interface Source<T> {
  value: T;
}
