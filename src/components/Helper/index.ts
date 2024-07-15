import { type Config, DATA, NOTICE_FILE } from '../../constants/constants'
import { TargetEntity, betterTell } from '../../utils/betterTell'
import Component from '../../utils/component'
import { ObjPosToStr, PosToObj } from '../../utils/position'
import t from '../../utils/t'
import Gui from '../Gui/index'

export default class Helper extends Component<Config['helper']> {
  private getHash(content: string) {
    return content.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0)
  }

  private loadNotice() {
    const noticeContent = File.readFrom(NOTICE_FILE)
    if (!noticeContent) return null
    return [noticeContent, this.getHash(noticeContent)] as const
  }

  private saveNotice(notice: string) {
    File.writeTo(NOTICE_FILE, notice)
  }

  public register() {
    if (this.config.nbtCommandEnabled) this.nbt()
    if (this.config.backCmdEnabled) this.back()
    if (this.config.suicideCmdEnabled) this.suicide()
    if (this.config.msguiCmdEnabled) this.msgui()
    if (this.config.clockCmdEnabled) this.clock()
    if (this.config.noticeCmdEnabled) this.notice()
    if (this.config.hereCmdEnabled) this.here()
  }

  private readonly playerDieCache: Map<string, Player['pos']> = new Map()

  private nbt() {
    const nbtCmd = this.cmd('nbt', t`cmd.nbt.description`, PermType.Any)
    nbtCmd.setEnum('Type', ['block', 'item', 'entity', 'self'])
    nbtCmd.mandatory('type', ParamType.Enum, 'Type', 1)
    nbtCmd.overload(['Type'])
    nbtCmd.overload([])
    nbtCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return
      const send = (nbt: NbtCompound | undefined) => pl.tell(nbt ? nbt.toString() : 'null')
      if (result.type === 'block') return send(pl.getBlockFromViewVector()?.getNbt())
      if (result.type === 'item') return send(pl.getHand().getNbt())
      if (result.type === 'entity') return send(pl.getEntityFromViewVector()?.getNbt())
      return send(pl.getNbt())
    })
  }

  private sendNotice(pl: Player) {
    const notice = this.loadNotice()
    if (!notice) {
      pl.tell(t`info.no_notice`)
      return
    }
    const [noticeContent, hash] = notice
    Gui.sendModal(pl, t`gui.notice.title`, noticeContent, (pl) => {
      const noticed = DATA.get('noticed')
      if (noticed.hash === hash) {
        if (noticed.list.includes(pl.xuid)) return
        noticed.list = [...noticed.list, pl.xuid]
        return
      }
      noticed.hash = hash
      noticed.list = [pl.xuid]
    })
  }

  private back() {
    const backCmd = this.cmd('back', t`cmd.back.description`, PermType.Any)
    backCmd.overload([])
    backCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return
      const pos = this.playerDieCache.get(pl.xuid)
      if (!pos) {
        out.error(t`cmd.back.msg.error`)
        return
      }
      pl.teleport(pos)
      out.success(t`cmd.back.msg.success`)
    })

    mc.listen('onPlayerDie', (pl) => {
      this.playerDieCache.set(pl.xuid, pl.pos)
      pl.tell(t('info.died', ObjPosToStr(PosToObj(pl.pos))))
    })
  }

  private suicide() {
    const suicideCmd = this.cmd('suicide', t`cmd.suicide.description`, PermType.Any)
    suicideCmd.overload([])
    suicideCmd.setCallback((_, { player: pl }) => {
      if (pl) pl.kill()
    })
  }

  private msgui() {
    const msguiCmd = this.cmd('msgui', t`cmd.msgui.description`, PermType.Any)
    msguiCmd.overload([])
    msguiCmd.setCallback(
      (_, { player: pl }) =>
        pl &&
        Gui.send(pl, {
          type: 'custom',
          title: t`gui.msgui.title`,
          elements: [
            { type: 'dropdown', title: t`gui.msgui.dropdown`, items: '@players' },
            { type: 'input', title: t`gui.msgui.input` }
          ],
          action: `/msg "{0}" "{1}"`
        })
      //const playersList = mc.getOnlinePlayers().map((pl) => pl.realName);
      //const form = mc.newCustomForm().setTitle('私聊').addDropdown('选择玩家', playersList, 0).addInput('发送内容');
      //pl.sendForm(form, (_, data) => data && pl.runcmd(`msg "${playersList[data[0]]}" "${data[1]}`));
    )
  }

  private clock() {
    const clockCmd = this.cmd('clock', t`cmd.clock.description`, PermType.Any)
    clockCmd.overload([])
    clockCmd.setCallback((_, { player: pl }) => {
      if (!pl) return
      pl.clearItem('minecraft:clock', 1)
      pl.giveItem(mc.newItem('minecraft:clock', 1) as Item)
    })
  }

  private notice() {
    const noticeCmd = this.cmd('notice', t`cmd.notice.description`, PermType.Any)
    noticeCmd.overload([])
    noticeCmd.setCallback((_, { player: pl }) => pl && this.sendNotice(pl))

    const noticesetCmd = this.cmd('noticeset', t`cmd.noticeset.description`, PermType.GameMasters)
    noticesetCmd.mandatory('content', ParamType.String)
    noticesetCmd.overload(['content'])
    noticesetCmd.setCallback((_, { player: pl }, out, { content }) => {
      this.saveNotice(content)
      const noticed = DATA.get('noticed')
      noticed.hash = this.getHash(content)
      noticed.list = []
      out.success(t`cmd.noticeset.msg`)
    })

    mc.listen('onJoin', (pl) => {
      const notice = this.loadNotice()
      if (!notice) return
      if (DATA.get('noticed').hash === notice[1] && DATA.get('noticed').list.includes(pl.xuid)) return
      this.sendNotice(pl)
    })
  }

  private here() {
    const hereCmd = this.cmd('here', t`cmd.here.description`, PermType.Any)
    hereCmd.overload([])
    hereCmd.setCallback((_, { player: pl }) => {
      if (pl) betterTell(t('info.here', pl.realName, ObjPosToStr(PosToObj(pl.pos))), TargetEntity.ALL)
    })
  }
}
