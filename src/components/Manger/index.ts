import { type Config, DATA } from '../../constants/constants'
import Component from '../../utils/component'
import t from '../../utils/t'
import Gui from '../Gui/index'

export default class Manger extends Component<Config['manger']> {
  public register() {
    if (this.config.vanishCmdEnabled) this.vanish()
    if (this.config.mangerCmdEnabled) this.manger()
    if (this.config.runasCmdEnabled) this.runas()
    if (this.config.banCmdEnabled) this.ban()
    if (this.config.stopCmdEnabled) this.stop()
    if (this.config.skickCmdEnabled) this.skick()
    if (this.config.crashCmdEnabled) this.crash()
    if (this.config.infoCmdEnabled) this.info()
    if (this.config.cloudBlackCheckEnabled) this.cloudBlackCheck()
    if (this.config.safeCmdEnabled) this.safeCmd()
  }

  private manger() {
    const btnList: { id: string; text: string; action: string }[] = []
    if (this.config.safeCmdEnabled) btnList.push({ id: 'safe', text: t`gui.manger.btn.safe`, action: '/safe' })
    if (this.config.vanishCmdEnabled) btnList.push({ id: 'vanish', text: t`gui.manger.btn.vanish`, action: '/vanish' })
    if (this.config.skickCmdEnabled)
      btnList.push({ id: 'skick', text: t`gui.manger.btn.skick`, action: '`/manger skick' })
    if (this.config.crashCmdEnabled)
      btnList.push({ id: 'crash', text: t`gui.manger.btn.crash`, action: '/manger crash' })
    if (this.config.infoCmdEnabled) btnList.push({ id: 'info', text: t`gui.manger.btn.info`, action: '/manger info' })
    if (this.config.banCmdEnabled)
      btnList.push(
        { id: 'ban', text: t`gui.manger.btn.ban`, action: '/manger ban' },
        { id: 'unban', text: t`gui.manger.btn.unban`, action: '/manger unban' },
        { id: 'banls', text: t`gui.manger.btn.banls`, action: '/ban ls' }
      )
    if (this.config.runasCmdEnabled)
      btnList.push({ id: 'runas', text: t`gui.manger.btn.runas`, action: '/manger runas' })
    if (this.config.stopCmdEnabled) btnList.push({ id: 'stop', text: t`gui.manger.btn.stop`, action: '/stops' })

    const mangerCmd = this.cmd('manger', t`cmd.manger.description`, PermType.GameMasters)
    mangerCmd.setEnum(
      'Action',
      btnList.map((el) => el.id)
    )
    mangerCmd.mandatory('action', ParamType.Enum, 'Action', 1)
    mangerCmd.overload(['action'])
    mangerCmd.overload([])
    mangerCmd.setCallback((_, { player: pl }, out, { action }) => {
      if (!pl) return
      switch (action) {
        case 'skick':
          Gui.send(pl, {
            title: t`gui.skick.title`,
            buttons: mc.getOnlinePlayers().map((pl) => ({ text: pl.realName, action: `/skick "${pl.realName}"` }))
          })
          break
        case 'crash':
          Gui.send(pl, {
            title: t`gui.crash.title`,
            buttons: mc.getOnlinePlayers().map((pl) => ({ text: pl.realName, action: `/crashes "${pl.realName}"` }))
          })
          break
        case 'info':
          Gui.send(pl, {
            title: t`gui.info.title`,
            buttons: mc.getOnlinePlayers().map((pl) => ({ text: pl.realName, action: `/info "${pl.realName}"` }))
          })
          break
        case 'ban':
          Gui.send(pl, {
            type: 'custom',
            title: t`gui.ban.title`,
            elements: [
              { title: t`gui.ban.player`, type: 'dropdown', items: '@players' },
              { title: t`gui.ban.banip`, type: 'switch', default: false },
              { title: t`gui.ban.time`, type: 'input', default: '0' },
              { title: t`gui.ban.reason`, type: 'input' }
            ],
            action: (pl: Player, player: string, banip: boolean, time?: number, reason?: string) =>
              pl.runcmd(
                `ban ${banip ? 'banip' : 'ban'} "${player}" ${Number.isNaN(Number(time)) ? Number(time) : 0}${reason ? ` "${reason}"` : ''}`
              )
          })
          break
        case 'banls':
          pl.runcmd('/ban ls')
          break
        case 'unban':
          Gui.send(pl, {
            title: t`gui.unban.title`,
            buttons: Object.entries(DATA.get('bans')).map(([name, data]) => ({
              text: name,
              action: `/ban unban "${name}"`
            }))
          })

          break
        case 'runas':
          Gui.send(pl, {
            type: 'custom',
            title: t`gui.runas.title`,
            elements: [
              { title: t`gui.runas.player`, type: 'dropdown', items: '@players' },
              { title: t`gui.runas.command`, type: 'input' }
            ],
            action: '/runas "{0}" "{1}"'
          })
          break
        default:
          Gui.send(pl, { title: t`gui.manger.title`, onlyOp: true, buttons: btnList })
      }
    })
  }

  private vanish() {
    const vanishCmd = this.cmd('vanish', t`cmd.vanish.description`, PermType.GameMasters)
    vanishCmd.overload([])
    vanishCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return
      if (pl.getAllEffects().find((id) => id === 14)) {
        pl.removeEffect(14)
        out.success(t`cmd.vanish.msg.off`)
        return
      }
      pl.addEffect(14, 9 * 10 ** 8, 225, false)
      out.success(t`cmd.vanish.msg.on`)
    })
  }

  private runas() {
    const runasCmd = this.cmd('runas', t`cmd.runas.description`, PermType.GameMasters)

    runasCmd.mandatory('player', ParamType.String)
    runasCmd.mandatory('command', ParamType.String)
    runasCmd.overload(['player', 'command'])

    runasCmd.setCallback((_, __, out, { player, command }) => {
      const target = mc.getPlayer(player)
      if (!target) {
        out.error(t`cmd.runas.msg.notFound`)
        return
      }
      target.runcmd(command)
      out.success(t('cmd.runas.msg.success', target.realName))
    })
  }

  private ban() {
    function banKick(pl: Player) {
      const allBans = DATA.get('bans')
      const ip = pl.getDevice().ip
      const name = pl.realName.toLowerCase()

      if (!(ip in allBans) && !(name in allBans)) return
      if (ip in allBans && allBans[ip].time !== 0 && allBans[ip].time < Date.now()) {
        delete allBans[ip]
        return
      }
      if (name in allBans && allBans[name].time !== 0 && allBans[name].time < Date.now()) {
        delete allBans[name]
        return
      }

      const { time, reason } = allBans[ip in allBans ? ip : name]
      const forever = time === 0
      const reasonStr = reason ? t('info.ban.reason', reason) : ''
      if (name in allBans) {
        pl.kick(forever ? t('info.ban.forever', reasonStr) : t('info.ban.time', time.toLocaleString(), reasonStr))
      } else {
        pl.kick(
          forever
            ? t('info.ban_ip.forever', ip, reasonStr)
            : t('info.ban_ip.time', ip, time.toLocaleString(), reasonStr)
        )
      }
      logger.warn(t('info.ban.kick', pl.realName))
    }

    const banCmd = this.cmd('ban', t`cmd.ban.description`, PermType.GameMasters)
    banCmd.setEnum('ListAction', ['ls'])
    banCmd.setEnum('UnbanAction', ['unban'])
    banCmd.setEnum('BanAction', ['ban', 'banip'])
    banCmd.mandatory('actiZon', ParamType.Enum, 'ListAction', 1)
    banCmd.mandatory('action', ParamType.Enum, 'UnbanAction', 1)
    banCmd.mandatory('action', ParamType.Enum, 'BanAction', 1)
    banCmd.mandatory('player', ParamType.String)
    banCmd.optional('time', ParamType.Int)
    banCmd.optional('reason', ParamType.String)
    banCmd.overload(['BanAction', 'player', 'time', 'reason'])
    banCmd.overload(['UnbanAction', 'player'])
    banCmd.overload(['ListAction'])
    banCmd.setCallback((_, __, out, result) => {
      const allBans = DATA.get('bans')

      if (result.action === 'ls') {
        if (Object.keys(allBans).length === 0) return out.success(t`cmd.ban.msg.empty`)
        return out.success(
          t(
            'cmd.ban.msg.list',
            Object.entries(allBans)
              .map(([key, data]) => {
                const reasonStr = data.reason ? t('info.ban.reason', data.reason) : ''
                if (key.includes('.')) {
                  return data.time === 0
                    ? t('cmd.ban.msg.item_ip.forever', key, reasonStr)
                    : t('cmd.ban.msg.item_ip.time', key, new Date(data.time).toLocaleString(), reasonStr)
                }
                return data.time === 0
                  ? t('cmd.ban.msg.item.forever', key, reasonStr)
                  : t('cmd.ban.msg.item.time', key, new Date(data.time).toLocaleString(), reasonStr)
              })
              .join('')
          )
        )
      }

      const { player, time, reason } = result

      if (result.action === 'unban') {
        if (!allBans[player]) return out.error(t`cmd.ban.msg.not_found_2`)
        delete allBans[player]
        return out.success(t('cmd.ban.msg.unban', player))
      }

      const endTime = new Date(Date.now() + time * 1000)
      const targetPl = mc.getPlayer(player)
      if (result.action === 'banip' && !targetPl) return out.error(t`cmd.ban.msg.not_found`)
      allBans[result.action === 'banip' ? targetPl.getDevice().ip : player.toLowerCase()] = {
        time: time ? endTime.getTime() : 0,
        reason
      }

      const reasonStr = reason ? t('info.ban.reason', reason) : ''
      if (targetPl) banKick(targetPl)
      if (result.action === 'banip') {
        return out.success(
          time
            ? t('cmd.ban.msg.ban_ip.time', player, endTime.toLocaleString(), reasonStr)
            : t('cmd.ban.msg.ban_ip.forever', player, reasonStr)
        )
      }
      return out.success(
        time
          ? t('cmd.ban.msg.ban.time', player, endTime.toLocaleString(), reasonStr)
          : t('cmd.ban.msg.ban.forever', player, reasonStr)
      )
    })

    setTimeout(() => {
      for (const pl of mc.getOnlinePlayers()) banKick(pl)
    }, 10 * 1000)
    mc.listen('onPreJoin', (pl) => pl && banKick(pl))
  }

  private cloudBlackCheck() {
    mc.listen('onPreJoin', (pl) => {
      network.httpGet(
        `https://api.blackbe.work/openapi/v3/check/?name=${pl.realName}&xuid=${pl.xuid}`,
        (status, result) => {
          if (status !== 200) return logger.error(t`cmd.cloudBlackCheck.msg.error`)
          if (JSON.parse(result).status !== 2000) return
          pl.kick(t`cmd.cloudBlackCheck.msg.kick`)
          logger.warn(t('cmd.cloudBlackCheck.msg.kicked', pl.realName))
        }
      )
    })
  }

  private skick() {
    const skickCmd = this.cmd('skick', t`cmd.skick.description`, PermType.GameMasters)
    skickCmd.mandatory('target', ParamType.String)
    skickCmd.optional('reason', ParamType.String)
    skickCmd.overload(['target', 'reason'])
    skickCmd.setCallback((_, __, out, { target, reason }) => {
      for (const pl of mc.getOnlinePlayers()) {
        if (!pl.realName.toLowerCase().startsWith(target.toLowerCase())) continue
        if (reason) pl.kick(reason)
        out.success(t('cmd.skick.msg', pl.realName))
      }
    })
  }

  private crash() {
    const crashCmd = this.cmd('crashes', t`cmd.crash.description`, PermType.GameMasters)
    crashCmd.mandatory('player', ParamType.String)
    crashCmd.overload(['player'])
    crashCmd.setCallback((_, __, out, { player }) =>
      mc.getPlayer(player)
        ? mc.getPlayer(player).crash()
          ? out.success(t`cmd.crash.msg.success`)
          : out.error(t`cmd.crash.msg.error`)
        : out.error(t`cmd.crash.msg.not_found`)
    )
  }

  private stop() {
    const stopCmd = this.cmd('stops', t`cmd.stop.description`, PermType.GameMasters)
    stopCmd.overload([])
    stopCmd.setCallback((_, __, out) => mc.runcmd('stop'))
  }

  private info() {
    const infoCmd = this.cmd('info', t`cmd.info.description`, PermType.GameMasters)
    infoCmd.mandatory('player', ParamType.String)
    infoCmd.overload(['player'])

    infoCmd.setCallback((_, __, out, { player }) => {
      const target = mc.getPlayer(player)
      if (!target) {
        out.error(t`cmd.info.msg.not_found`)
        return
      }

      const device = target.getDevice()
      out.success(
        t(
          'cmd.info.msg',
          target.realName,
          target.xuid,
          target.uuid,
          device.ip,
          device.os,
          String(device.inputMode),
          String(device.avgPing),
          String(device.avgPacketLoss),
          device.serverAddress,
          device.clientId
        )
      )
    })
  }

  private safeCmd() {
    const safeCmd = this.cmd('safe', t`cmd.safe.description`, PermType.GameMasters)
    safeCmd.setEnum('Status', ['on', 'off'])
    safeCmd.mandatory('status', ParamType.Enum, 'Status')
    safeCmd.overload(['status'])
    safeCmd.overload([])
    safeCmd.setCallback((_, { player: pl }, out, { status }) => {
      const safe = DATA.get('safe')
      if (['on', 'off'].includes(status)) {
        safe.status = status === 'on'
        out.success(t`cmd.safe.msg`)
        return
      }

      if (!pl) return
      Gui.send(pl, {
        type: 'custom',
        title: t`gui.safe.title`,
        elements: [
          { type: 'label', text: t`gui.safe.label` },
          { type: 'switch', title: t`gui.safe.switch`, default: DATA.get('safe').status }
        ],
        action: (_, __, status) => pl.runcmd(`/safe ${status ? 'on' : 'off'}`)
      })
    })

    mc.listen('onPreJoin', (pl) => {
      if (DATA.get('safe').status && !pl.isOP()) pl.disconnect('info.safe_mode')
    })
  }
}
