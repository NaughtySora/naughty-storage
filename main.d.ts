type Callback = (...args: any[]) => any;

export class MemoryStorage {
  constructor(collection: string);
  get(name: string): Promise<any>;
  set(name: string, data: any): Promise<boolean>;
  clear(): Promise<boolean>;
  delete(name: string): Promise<boolean>;
  has(name: string): Promise<boolean>;
  [Symbol.asyncIterator](): AsyncIterator<any>;
  entries(): this;
  values(): AsyncGenerator<any>
  keys(): AsyncGenerator<string>;
  pick<F extends Callback>(name: string, target: F, ...params: Partial<any[]>): Promise<boolean>;
  get size(): Promise<number>;
  static truncate(): Promise<boolean>;
  static destroy(): Promise<boolean>;
  static location(dist: string): void;
}

export class FileStorage {
  constructor(collection: string);
  get(name: string): Promise<any>;
  set(name: string, data: any): Promise<boolean>;
  clear(): Promise<boolean>;
  delete(name: string): Promise<boolean>;
  has(name: string): Promise<boolean>;
  [Symbol.asyncIterator](): AsyncIterator<any>;
  entries(): this;
  values(): AsyncGenerator<any>;
  keys(): AsyncGenerator<string>;
  pick<F extends Callback>(name: string, target: F, ...params: Partial<any[]>): Promise<boolean>;
  get size(): Promise<number>;
  static truncate(): Promise<boolean>;
  static destroy(): Promise<boolean>;
  static location(dist: string): void;
}