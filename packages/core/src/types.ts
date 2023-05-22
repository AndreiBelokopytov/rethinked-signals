export interface Disposable {
  isDisposed: boolean;
  dispose(): void;
}

export type Callback = () => unknown;

export interface Source<T> {
  value: T;
}

export interface Target extends Disposable {
  notify(): unknown;
  addDependency(source: Source<unknown>): void;
  hasDependency(source: Source<unknown>): boolean;
}
