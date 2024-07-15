import type { Config } from '../../constants/constants'
import { TargetEntity, betterTell } from '../../utils/betterTell'
import Component from '../../utils/component'
import { tp } from '../../utils/t'

export default class Utils extends Component<Config['utils']> {
  public register() {
    this.itemsOnUse()
    if (this.config.joinWelcomeEnabled) this.joinWelcome()
    if (this.config.motdDynastyEnabled && this.config.motdMsgs.length > 0) this.motdDynasty()
    if (this.config.chatFormatEnabled) this.chatFormat()
    if (this.config.sidebarEnabled) this.sidebar()
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
    mc.listen('onJoin', (pl) => pl.tell(tp(this.config.joinWelcomeMsg, pl)))
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
    setInterval(() => mc.setMotd(motdGen.next().value as string), this.config.motdInterval * 1000)
  }

  private chatFormat() {
    mc.listen('onChat', (pl, msg) => {
      betterTell(`${tp(this.config.chatFormat, pl).replace('%msg%', msg)}`, TargetEntity.ALL)
      return false
    })
  }

  private sidebar() {
    setInterval(() => {
      for (const pl of mc.getOnlinePlayers()) {
        const list: Record<string, number> = {}
        for (let i = 0; i < this.config.sidebarList.length; i += 1) {
          list[tp(this.config.sidebarList[i], pl)] = i
        }
        pl.removeSidebar()
        pl.setSidebar(this.config.sidebarTitle, list, 0)
      }
    }, 1000)
  }
}
