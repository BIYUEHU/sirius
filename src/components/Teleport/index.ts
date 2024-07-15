import { type Config, DATA } from '../../constants/constants'
import Component from '../../utils/component'
import { ObjToPos, PosToObj } from '../../utils/position'
import Gui from '../Gui/index'
import t from '../../utils/t'

export default class Teleport extends Component<Config['teleport']> {
  public register() {
    if (this.config.transferCmdEnabled) this.transfer()
    if (this.config.tprCmdEnabled) this.tpr()
    if (this.config.tpaCmdEnabled) this.tpa()
    if (this.config.homeCmdEnabled) this.home()
    if (this.config.warpCmdEnabled) this.warp()
  }

  private readonly tpaTargetsRunning: Map<string, [string, () => void]> = new Map()

  private transfer() {
    const transferCmd = this.cmd('transfers', t`cmd.transfer.description`, PermType.GameMasters)
    transferCmd.mandatory('player', ParamType.Player)
    transferCmd.mandatory('ip', ParamType.String)
    transferCmd.optional('port', ParamType.Int)
    transferCmd.overload(['player', 'ip', 'port'])
    transferCmd.setCallback((_, __, out, { ip, port, player }) => {
      out.addMessage(t('cmd.transfer.msg.transfer', ip, String(port)))
      for (const pl of player) {
        pl.transServer(ip, port ?? 19132)
      }
    })
  }

  private tpr() {
    const tprCmd = this.cmd('tpr', t`cmd.tpr.description`, PermType.Any)
    tprCmd.overload([])
    tprCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return
      if (pl.pos.dimid !== 0) {
        out.error(t`cmd.tpr.msg.error.dimension`)
        return
      }

      const init = this.config.tprMaxDistance - this.config.tprMinDistance + 1 + this.config.tprMinDistance
      const position = mc.newIntPos(
        Math.floor(Math.random() * init),
        this.config.tprSafeHeight,
        Math.floor(Math.random() * init),
        0
      )
      pl.teleport(position)
      pl.addEffect(27, 10 * 27, 1, false)
      out.success(t('cmd.tpr.msg.success', position.toString()))
    })
  }

  private getTpaRunningBySender(target: Player) {
    let callback: undefined | (() => void)
    for (const value of this.tpaTargetsRunning.values()) {
      if (callback) continue
      if (value[0] === target.xuid) callback = value[1]
    }
    return callback
  }

  private removeTpaRunningBySender(pl: Player) {
    this.tpaTargetsRunning.forEach((value, key) => {
      if (value[0] === pl.xuid) this.tpaTargetsRunning.delete(key)
    })
  }

  private tpa() {
    const tpaCmd = this.cmd('tpa', t`cmd.tpa.description`, PermType.Any)
    tpaCmd.setEnum('RequestAction', ['to', 'here'])
    tpaCmd.setEnum('ResponseAction', ['ac', 'de', 'cancel', 'toggle', 'gui_toggle', 'gui'])
    tpaCmd.mandatory('action', ParamType.Enum, 'RequestAction', 1)
    tpaCmd.mandatory('action', ParamType.Enum, 'ResponseAction', 1)
    tpaCmd.mandatory('player', ParamType.String)
    tpaCmd.overload(['RequestAction', 'player'])
    tpaCmd.overload(['ResponseAction'])

    tpaCmd.setCallback((_, { player: pl }, out, result) => {
      const sendTpaModal = (message: string, command: string) =>
        Gui.sendModal(
          mc.getPlayer(result.player),
          t`gui.tpa.title`,
          message,
          (targetPl) => {
            targetPl.runcmd(command)
            out.success(t`cmd.tpa.msg.accepted`)
          },
          () => out.error(t`cmd.tpa.msg.rejected`),
          t`gui.tpa.btn.accept`,
          t`gui.tpa.btn.reject`
        )
      if (!pl) return

      const enableList = DATA.get('tpasEnableList')

      // Gui
      if (result.action === 'gui') {
        return Gui.send(pl, {
          type: 'custom',
          title: t`gui.tpa.title`,
          elements: [
            { type: 'dropdown', title: t`gui.tpa.dropdown.mode`, items: ['to', 'here'] },
            { type: 'dropdown', title: t`gui.tpa.dropdown.target`, items: '@players' }
          ],
          action: '/tpa {0} "{1}"'
        })
      }

      if (result.action === 'gui_toggle') {
        return Gui.send(pl, {
          type: 'custom',
          title: t`gui.tpa.settings.title`,
          elements: [{ type: 'switch', title: t`gui.tpa.settings.block`, default: enableList.includes(pl.xuid) }],
          action: (pl, enabled) => {
            if (enabled === enableList.includes(pl.xuid)) pl.runcmd('tpa toggle')
            pl.runcmd('tpa toggle')
          }
        })
      }

      // As sender
      if (['to', 'here', 'cancel'].includes(result.action)) {
        const hasRunning = this.getTpaRunningBySender(pl)

        if (result.action === 'cancel') {
          if (!hasRunning) return out.error(t`cmd.tpa.msg.error.no_request`)
          this.removeTpaRunningBySender(pl)
          return out.success(t`cmd.tpa.msg.canceled`)
        }

        if (hasRunning) return out.error(t`cmd.tpa.msg.error.existing_request`)

        const targetPl = mc.getPlayer(result.player)
        if (!targetPl) return out.error(t`cmd.tpa.msg.error.player_offline`)
        if (enableList.includes(targetPl.xuid)) return out.error(t`cmd.tpa.msg.error.blocked`)

        // Auto clear expired tpa
        setTimeout(() => {
          if (!this.tpaTargetsRunning.has(targetPl.xuid)) return
          const sender = mc.getPlayer((this.tpaTargetsRunning.get(targetPl.xuid) as [string, () => void])[0])
          if (sender) sender.tell(t`cmd.tpa.msg.expired`)
          this.tpaTargetsRunning.delete(targetPl.xuid)
        }, this.config.tpaExpireTime * 1000)

        if (result.action === 'to') {
          this.tpaTargetsRunning.set(targetPl.xuid, [pl.xuid, () => pl.teleport(targetPl.pos)])
          sendTpaModal(t('cmd.tpa.msg.request.to.req', pl.realName), 'tpa ac')
          mc.getPlayer(targetPl.xuid).tell(t('cmd.tpa.msg.request.to.notify', pl.realName))
          return out.success(t('cmd.tpa.msg.sent.to', targetPl.realName))
        }

        this.tpaTargetsRunning.set(targetPl.xuid, [pl.xuid, () => targetPl.teleport(pl.pos)])
        sendTpaModal(t('cmd.tpa.msg.request.here.req', pl.realName), 'tpa ac')
        mc.getPlayer(targetPl.xuid).tell(t('cmd.tpa.msg.request.here.notify', pl.realName))
        return out.success(t('cmd.tpa.msg.sent.here', targetPl.realName))
      }

      // As receiver
      if (['ac', 'de'].includes(result.action)) {
        if (!this.tpaTargetsRunning.has(pl.xuid)) return pl.tell(t`cmd.tpa.msg.error.no_request`)
        const [senderXuid, callback] = this.tpaTargetsRunning.get(pl.xuid) as [string, () => void]
        const sender = mc.getPlayer(senderXuid)
        if (result.action === 'ac') {
          callback()
          out.success(t('cmd.tpa.msg.accept.req', sender.realName))
          sender.tell(t('cmd.tpa.msg.accept.notify', pl.realName))
        } else {
          out.success(t('cmd.tpa.msg.reject.req', sender.realName))
          sender.tell(t('cmd.tpa.msg.reject.notify', pl.realName))
        }
        return this.tpaTargetsRunning.delete(pl.xuid)
      }

      if (enableList.includes(pl.xuid)) {
        DATA.set(
          'tpasEnableList',
          enableList.filter((x) => x !== pl.xuid)
        )
        return pl.tell(t`cmd.tpa.msg.unblocked`)
      }

      DATA.set('tpasEnableList', [...enableList, pl.xuid])
      return out.success(t`cmd.tpa.msg.blocked`)
    })

    // Auto clear on players leaving
    mc.listen('onLeft', (pl) => {
      this.removeTpaRunningBySender(pl)
      this.tpaTargetsRunning.delete(pl.xuid)
    })
  }

  private home() {
    const homeCmd = this.cmd('home', t`cmd.home.description`, PermType.Any)
    homeCmd.setEnum('GuiAction', ['ls', 'gui_add', 'gui_del'])
    homeCmd.setEnum('OptionAction', ['add', 'del', 'go'])
    homeCmd.mandatory('action', ParamType.Enum, 'GuiAction', 1)
    homeCmd.mandatory('action', ParamType.Enum, 'OptionAction', 1)
    homeCmd.mandatory('home', ParamType.String)
    homeCmd.overload(['OptionAction', 'home'])
    homeCmd.overload(['GuiAction'])
    homeCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return

      const allHomes = DATA.get('homes')
      if (!(pl.xuid in allHomes)) allHomes[pl.xuid] = {}
      const homes = allHomes[pl.xuid]

      // Gui
      if (['gui_del', 'ls'].includes(result.action)) {
        if (result.action === 'ls') {
          if (Object.keys(homes).length === 0) return out.error(t`cmd.home.msg.error.no_homes`)
          return Gui.send(pl, {
            title: t`gui.home.title`,
            buttons: Object.keys(homes).map((text) => ({ text, action: `/home go "${text}"` }))
          })
        }

        return Gui.send(pl, {
          title: t`gui.home.delete.title`,
          content: t`gui.home.delete.content`,
          buttons: Object.keys(homes).map((text) => ({ text, action: `/home del "${text}"` }))
        })
      }

      if (result.action === 'gui_add') {
        return Gui.send(pl, {
          type: 'custom',
          title: t`gui.home.add.title`,
          elements: [{ type: 'input', title: t`gui.home.add.name` }],
          action: '/home add "{0}"'
        })
      }

      // Operation
      if (result.action === 'go') {
        if (!homes[result.home]) return out.error(t('cmd.home.msg.error.not_exist', result.home))
        return pl.teleport(ObjToPos(homes[result.home]))
      }

      if (result.action === 'add') {
        if (homes[result.home]) return out.error(t('cmd.home.msg.error.already_exist', result.home))
        if (Object.keys(homes).length >= this.config.homeMaxCount) return out.error(t`cmd.home.msg.error.limit`)
        homes[result.home] = PosToObj(pl.pos)
        return out.success(t('cmd.home.msg.added', result.home))
      }

      if (!homes[result.home]) return out.error(t('cmd.home.msg.error.not_exist', result.home))
      delete homes[result.home]
      return out.success(t('cmd.home.msg.deleted', result.home))
    })
  }

  private warp() {
    const warpCmd = this.cmd('warp', t`cmd.warp.description`, PermType.Any)
    warpCmd.setEnum('GuiAction', ['ls', 'gui_add', 'gui_del'])
    warpCmd.setEnum('OptionAction', ['add', 'del', 'go'])
    warpCmd.mandatory('action', ParamType.Enum, 'GuiAction', 1)
    warpCmd.mandatory('action', ParamType.Enum, 'OptionAction', 1)
    warpCmd.mandatory('warp', ParamType.String)
    warpCmd.overload(['OptionAction', 'warp'])
    warpCmd.overload(['GuiAction'])
    warpCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return

      const warps = DATA.get('warps')

      // Gui
      if (['gui_del', 'ls'].includes(result.action)) {
        if (result.action === 'ls') {
          if (Object.keys(warps).length === 0) return out.error(t`cmd.warp.msg.error.no_warps`)
          return Gui.send(pl, {
            title: t`gui.warp.title`,
            buttons: Object.keys(warps).map((text) => ({ text, action: `/warp go "${text}"` }))
          })
        }

        return Gui.send(pl, {
          title: t`gui.warp.delete.title`,
          content: t`gui.warp.delete.content`,
          onlyOp: true,
          buttons: Object.keys(warps).map((text) => ({ text, action: `/warp del "${text}"` }))
        })
      }

      if (result.action === 'gui_add') {
        return Gui.send(pl, {
          type: 'custom',
          title: t`gui.warp.add.title`,
          onlyOp: true,
          elements: [{ type: 'input', title: t`gui.warp.add.name` }],
          action: '/warp add "{0}"'
        })
      }

      // Operation
      if (result.action === 'go') {
        if (!warps[result.warp]) return out.error(t('cmd.warp.msg.error.not_exist', result.warp))
        return pl.teleport(ObjToPos(warps[result.warp]))
      }

      if (!pl.isOP()) return out.error(t`cmd.warp.msg.error.no_permission`)

      if (result.action === 'add') {
        if (warps[result.warp]) return out.error(t('cmd.warp.msg.error.already_exist', result.warp))
        warps[result.warp] = PosToObj(pl.pos)
        return out.success(t('cmd.warp.msg.added', result.warp))
      }

      if (!warps[result.warp]) return out.error(t('cmd.warp.msg.error.not_exist', result.warp))
      delete warps[result.warp]
      return out.success(t('cmd.warp.msg.deleted', result.warp))
    })
  }
}
