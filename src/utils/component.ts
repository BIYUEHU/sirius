export abstract class Component<C extends Record<string, any> | never = never> {
  protected readonly config: C;

  public constructor(config: C) {
    this.config = config;
    if (!this.config.enabled) return;
    this.register();
    mc.listen('onServerStarted', () => this.cmds.forEach((cmd) => cmd.setup()));
  }

  private readonly cmds: ReturnType<typeof mc.newCommand>[] = [];

  protected readonly cmd = new Proxy(mc.newCommand.bind(mc), {
    apply: (target, thisArg, args) => {
      const command = Reflect.apply(target, thisArg, args);
      this.cmds.push(command);
      return command;
    }
  });

  public abstract register(): void;
}

export default Component;
