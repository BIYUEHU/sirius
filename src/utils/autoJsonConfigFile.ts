export default class AutoJsonConfigFile<T extends Record<string, any> = Record<string, any>> {
  private origin: JsonConfigFile
  private proxyCache: WeakMap<object, any> = new WeakMap()

  private createProxy(key: string, value: any, topObj: any): any {
    if ((typeof value !== 'object' && !Array.isArray(value)) || value === null) return value
    if (this.proxyCache.has(value)) return this.proxyCache.get(value)

    const self = this
    const topKey = key.split('.')[0]
    const proxy = new Proxy(value, {
      get(target: any, prop: string | symbol): any {
        const result = Reflect.get(target, prop)
        return self.createProxy(`${key}.${String(prop)}`, result, topObj)
      },
      set(target: any, prop: string | symbol, newValue: any): boolean {
        Reflect.set(target, prop, newValue)
        return self.set(topKey, topObj)
      },
      deleteProperty(target: any, prop: string | symbol): boolean {
        // logger.info(`Config file: ${key}.${String(prop)}`)
        Reflect.deleteProperty(target, prop)
        return self.set(topKey, topObj)
      }
    })

    this.proxyCache.set(value, proxy)
    return proxy
  }

  public readonly defaults?: T

  public constructor(filePath: string, defaults?: T) {
    this.origin = new JsonConfigFile(filePath)
    this.defaults = defaults
    this.origin.write(JSON.stringify(defaults || {}, null, 2))
  }

  public get<K extends keyof T>(key: K): T[K] {
    const value = this.origin.get(String(key))
    return this.createProxy(String(key), value, value) as T[K]
  }

  public set<K extends keyof T>(key: K, value: T[K]) {
    return this.origin.set(String(key), value)
  }

  public delete<K extends keyof T>(key: K) {
    return this.origin.delete(String(key))
  }

  public reload() {
    return this.origin.reload()
  }

  public write(data: T) {
    return this.origin.write(JSON.stringify(data ?? this.defaults ?? {}, null, 2))
  }

  public read() {
    return JSON.parse(this.origin.read())
  }
}
