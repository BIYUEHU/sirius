export default class AutoJsonConfigFile<T extends Record<string, any> = Record<string, any>> {
  private origin: JsonConfigFile;
  private proxyCache: WeakMap<object, any> = new WeakMap();

  private createProxy(key: string, value: any): any {
    if ((typeof value !== 'object' && !Array.isArray(value)) || value === null) return value;
    if (this.proxyCache.has(value)) return this.proxyCache.get(value);

    const self = this;
    const proxy = new Proxy(value, {
      get(target: any, prop: string | symbol): any {
        const result = Reflect.get(target, prop);
        return self.createProxy(`${key}.${String(prop)}`, result);
      },
      set(target: any, prop: string | symbol, newValue: any): boolean {
        Reflect.set(target, prop, newValue);
        return self.set(key, target);
      },
      deleteProperty(target: any, prop: string | symbol): boolean {
        Reflect.deleteProperty(target, prop);
        return self.set(key, target);
      }
    });

    this.proxyCache.set(value, proxy);
    return proxy;
  }

  public readonly defaults?: T;

  public constructor(filePath: string, defaults?: T) {
    this.origin = new JsonConfigFile(filePath, JSON.stringify(defaults || {}, null, 2));
    this.defaults = defaults;
  }

  public get<K extends keyof T>(key: K): T[K] {
    const value = this.origin.get(String(key));
    return this.createProxy(String(key), value) as T[K];
  }

  public set<K extends keyof T>(key: K, value: T[K]) {
    return this.origin.set(String(key), value);
  }

  public delete<K extends keyof T>(key: K) {
    return this.origin.delete(String(key));
  }
}
