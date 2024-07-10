import Component from './component'
import AutoJsonConfigFile from './autoJsonConfigFile'
import { DATA } from '../constants'

interface LoaderMeta {
  name: string
  version: [number, number, number]
  description: string
  author?: string
  license?: string
  repository?: string
}

type ComponentConsturctor = new (...args: ConstructorParameters<typeof Component<any>>) => Component<any>

type ComponentData = [string, ComponentConsturctor]

export default class Loader {
  private meta: LoaderMeta

  private config?: AutoJsonConfigFile

  private components: Map<ComponentData[0], ComponentData[1]> = new Map()

  private fallback: () => void

  public constructor(
    meta: LoaderMeta,
    config?: AutoJsonConfigFile,
    components?: ComponentData[],
    fallback: () => void = () => {}
  ) {
    this.meta = meta
    this.config = config
    this.fallback = fallback
    components?.forEach(([name, component]) => this.components.set(name, component))
  }

  public use(name: string, component: ComponentData[1]) {
    this.components.set(name, component)
  }

  public get(name: string) {
    return this.components.get(name)
  }

  public load() {
    const { name, description, version } = this.meta
    delete (this.meta as { name?: unknown }).name
    delete (this.meta as { description?: unknown }).description
    delete (this.meta as { version?: unknown }).version

    ll.registerPlugin(
      name,
      description,
      version,
      this.meta as Omit<typeof this.meta, 'name' | 'description' | 'version'>
    )

    this.fallback()

    this.components.forEach((component, name) => {
      const config = this.config?.get(name)
      if (!config || config.enabled) new component(config ?? {}).register()
    })

    logger.info(`Sirius Loaded v${version.join('.')}`)
  }

  protected getXuid(playerName: string) {
    return Object.values(DATA.get('xuids')).find((name) => playerName === name)
  }

  protected getPlayerName(xuid: string) {
    return DATA.get('xuids')[xuid] as String | undefined
  }
}
