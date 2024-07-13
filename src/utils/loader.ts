import type Component from './component'
import type AutoConfigFile from './autoConfigFile'

interface LoaderMeta {
  name: string
  version: [number, number, number]
  description: string
  author?: string
  license?: string
  repository?: string
}

// biome-ignore lint:
type ComponentConstructor = new (...args: ConstructorParameters<typeof Component<any>>) => Component<any>

type ComponentData = [string, ComponentConstructor]

export default class Loader {
  private meta: LoaderMeta

  private config?: AutoConfigFile

  private components: Map<ComponentData[0], ComponentData[1]> = new Map()

  private fallback: () => void

  public constructor(
    meta: LoaderMeta,
    config?: AutoConfigFile,
    components?: ComponentData[],
    fallback: () => void = () => {}
  ) {
    this.meta = meta
    this.config = config
    this.fallback = fallback
    if (!components) return
    for (const [name, component] of components) this.components.set(name, component)
  }

  public use(name: string, component: ComponentData[1]) {
    this.components.set(name, component)
  }

  public get(name: string) {
    return this.components.get(name)
  }

  public load() {
    const { name, description, version } = this.meta
    // biome-ignore lint:
    delete (this.meta as { name?: unknown }).name
    // biome-ignore lint:
    delete (this.meta as { description?: unknown }).description
    // biome-ignore lint:
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
}
