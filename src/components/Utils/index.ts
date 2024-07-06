import { Config, DATA } from '../../constants'
import { TargetEntity, betterTell } from '../../utils/betterTell'
import Component from '../../utils/component'
import Gui from '../Gui/index'

export default class Utils extends Component<Config['utils']> {
  public register() {
    this.itemsOnUse()
    if (this.config.joinWelcomeEnabled) this.joinWelcome()
    if (this.config.motdDynastyEnabled && this.config.motdMsgs.length > 0) this.motdDynasty()
    if (this.config.chatFormatEnabled) this.chatFormat()
    if (this.config.safeCmdEnabled) this.safeCmd()
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

  private safeCmd() {
    const safeCmd = this.cmd('safe', '服务器维护状态切换', PermType.GameMasters)
    safeCmd.setEnum('Status', ['on', 'off'])
    safeCmd.mandatory('status', ParamType.Enum, 'Status')
    safeCmd.overload(['status'])
    safeCmd.overload([])
    safeCmd.setCallback((_, { player: pl }, out, { status }) => {
      if (status === 'on') return DATA.set('safety', true)
      if (status === 'off') return DATA.set('safety', false)

      if (!pl) return
      Gui.send(pl, {
        type: 'custom',
        title: '服务器维护状态切换',
        elements: [
          { type: 'label', text: '开启服务器维护后，非管理员将无法进入服务器' },
          { type: 'switch', title: '维护状态', default: !!DATA.get('safety') }
        ],
        action: (_, status) => {
          DATA.set('safety', status)
          out.success('设置成功')
        }
      })
    })

    mc.listen('onPreJoin', (pl) => DATA.get('safety') && pl.disconnect('服务器维护中，请稍后再试'))
  }
}
