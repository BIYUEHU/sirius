import { DATA } from '../constants/constants'

// biome-ignore lint:
export default abstract class Component<C extends Record<string, any> | never = never> {
  protected readonly config: C

  public constructor(config: C) {
    this.config = config

    /* Don't apply function in the original class */
    // this.register();
    mc.listen('onServerStarted', () => {
      for (const cmd of this.cmds) cmd.setup()
    })
  }

  private readonly cmds: ReturnType<typeof mc.newCommand>[] = []

  protected readonly cmd = new Proxy(mc.newCommand.bind(mc), {
    apply: (target, thisArg, args) => {
      const command = Reflect.apply(target, thisArg, args)
      this.cmds.push(command)
      return command
    }
  })

  public abstract register(): void

  protected getXuid(playerName: string) {
    return Object.values(DATA.get('xuids')).find((name) => playerName === name) ?? 'unknown'
  }

  protected getPlayerName(xuid: string) {
    return DATA.get('xuids')[xuid] ?? '???'
  }
}
