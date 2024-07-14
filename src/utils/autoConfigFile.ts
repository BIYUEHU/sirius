import { COMMON_KEY } from '../constants/constants'
import TOML from '../modules/tomlParser'
import asCrypto from './asCrypto'

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

  public readonly decode: boolean

  public constructor(filePath: string, defaults?: T, decode?: boolean) {
    this.filePath = filePath
    this.defaults = defaults
    this.decode = !!decode
    const content = file.readFrom(this.filePath) ?? ''
    this.cache = Object.assign(
      this.defaults ?? {},
      file.exists(this.filePath)
        ? TOML.parse(asCrypto.isEncrypted(content) ? asCrypto.decrypt(content, COMMON_KEY) : content)
        : {}
    ) as T
    const writeContent = TOML.stringify(this.cache)
    File.writeTo(this.filePath, this.decode ? asCrypto.encrypt(writeContent, COMMON_KEY) : writeContent)
  }

  public get<K extends keyof T>(key: K): T[K] {
    const value = this.cache[key]
    return this.createProxy(String(key), value, value) as T[K]
  }

  public set<K extends keyof T>(key: K, value: T[K]) {
    this.cache[key] = value
    const writeContent = TOML.stringify(this.cache)
    return File.writeTo(this.filePath, this.decode ? asCrypto.encrypt(writeContent, COMMON_KEY) : writeContent)
  }

  public delete<K extends keyof T>(key: K) {
    delete this.cache[key]
    const writeContent = TOML.stringify(this.cache)
    return File.writeTo(this.filePath, this.decode ? asCrypto.encrypt(writeContent, COMMON_KEY) : writeContent)
  }

  public reload() {
    const readContent = file.readFrom(this.filePath) ?? ''
    this.cache = TOML.parse(
      asCrypto.isEncrypted(readContent) ? asCrypto.decrypt(readContent, COMMON_KEY) : readContent
    ) as T
  }

  public write(data: T) {
    this.cache = data
    const writeContent = TOML.stringify(this.cache)
    return File.writeTo(this.filePath, this.decode ? asCrypto.encrypt(writeContent, COMMON_KEY) : writeContent)
  }

  public read() {
    return this.cache
  }
}
