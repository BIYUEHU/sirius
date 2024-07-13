import TOML from '../modules/tomlParser'

// biome-ignore lint:
export default class AutoConfigFile<T extends Record<string, any> = Record<string, any>> {
  // biome-ignore lint:
  private proxyCache: WeakMap<object, any> = new WeakMap()

  // biome-ignore lint:
  private createProxy(key: string, value: any, topObj: any): any {
    if ((typeof value !== 'object' && !Array.isArray(value)) || value === null) return value
    if (this.proxyCache.has(value)) return this.proxyCache.get(value)

    const self = this
    const topKey = key.split('.')[0]
    const proxy = new Proxy(value, {
      // biome-ignore lint:
      get(target: any, prop: string | symbol): any {
        const result = Reflect.get(target, prop)
        return self.createProxy(`${key}.${String(prop)}`, result, topObj)
      },
      // biome-ignore lint:
      set(target: any, prop: string | symbol, newValue: any): boolean {
        Reflect.set(target, prop, newValue)
        return self.set(topKey, topObj)
      },
      // biome-ignore lint:
      deleteProperty(target: any, prop: string | symbol): boolean {
        // logger.info(`Config file: ${key}.${String(prop)}`)
        Reflect.deleteProperty(target, prop)
        return self.set(topKey, topObj)
      }
    })

    this.proxyCache.set(value, proxy)
    return proxy
  }

  private cache: T

  private readonly filePath: string

  public readonly defaults?: T

  public constructor(filePath: string, defaults?: T) {
    this.filePath = filePath
    this.defaults = defaults
    this.cache = Object.assign(
      this.defaults ?? {},
      file.exists(this.filePath) ? TOML.parse(file.readFrom(this.filePath) ?? '') : {}
    ) as T
    File.writeTo(this.filePath, TOML.stringify(this.cache))
  }

  public get<K extends keyof T>(key: K): T[K] {
    const value = this.cache[key]
    return this.createProxy(String(key), value, value) as T[K]
  }

  public set<K extends keyof T>(key: K, value: T[K]) {
    this.cache[key] = value
    return File.writeTo(this.filePath, TOML.stringify(this.cache))
  }

  public delete<K extends keyof T>(key: K) {
    delete this.cache[key]
    return File.writeTo(this.filePath, TOML.stringify(this.cache))
  }

  public reload() {
    this.cache = TOML.parse(file.readFrom(this.filePath) ?? '') as T
  }

  public write(data: T) {
    this.cache = data
    return File.writeTo(this.filePath, TOML.stringify(this.cache))
  }

  public read() {
    return this.cache
  }
}
