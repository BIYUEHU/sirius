import { Config } from '../../constants'
import { TargetEntity, betterTell } from '../../utils/betterTell'
import Component from '../../utils/component'

export default class Utils extends Component<Config['utils']> {
  public register() {
    this.itemsOnUse()
    if (this.config.joinWelcomeEnabled) this.joinWelcome()
    if (this.config.motdDynastyEnabled && this.config.motdMsgs.length > 0) this.motdDynasty()
    if (this.config.chatFormatEnabled) this.chatFormat()
  }

  private playerItemsUsing: Set<string> = new Set()

  private itemsOnUse() {
    mc.listen('onUseItemOn', (pl, item) => {
      if (!(item.type in this.config.itemsUseOn)) return
      if (this.playerItemsUsing.has(pl.xuid)) return
      this.playerItemsUsing.add(pl.xuid)
      setTimeout(() => this.playerItemsUsing.delete(pl.xuid), 500)
      pl.runcmd(this.config.itemsUseOn[item.type])
    })
  }

  private joinWelcome() {
    mc.listen('onJoin', (pl) => pl.tell(this.config.joinWelcomeMsg.replace('%player%', pl.realName)))
  }

  private motdDynasty() {
    const { motdMsgs } = this.config
    function* cycleMotd(): Generator<string, void, unknown> {
      while (true) {
        for (const motd of motdMsgs) {
          yield motd
        }
      }
    }
    const motdGen = cycleMotd()
    setInterval(() => mc.setMotd(motdGen.next().value!), this.config.motdInterval * 1000)
  }

  private chatFormat() {
    mc.listen('onChat', (pl, msg) => {
      betterTell(
        `${this.config.chatFormat.replace('%player%', pl.realName).replace('%message%', msg)}`,
        TargetEntity.ALL
      )
      return false
    })
  }
}
