import { Config, DATA } from '../../constants'
import Component from '../../utils/component'
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
  }

  private manger() {
    const btnList: { id: string; text: string; action: string }[] = []
    if (this.config.vanishCmdEnabled) btnList.push({ id: 'vanish', text: '设置隐身', action: '/vanish' })
    if (this.config.skickCmdEnabled) btnList.push({ id: 'skick', text: '踢出玩家', action: '`/manger skick' })
    if (this.config.crashCmdEnabled) btnList.push({ id: 'crash', text: '强制崩玩家', action: '/manger crash' })
    if (this.config.infoCmdEnabled) btnList.push({ id: 'info', text: '获取玩家信息', action: '/manger info' })
    if (this.config.banCmdEnabled)
      btnList.push(
        { id: 'ban', text: '封禁玩家', action: '/manger ban' },
        { id: 'unban', text: '解除封禁', action: '/manger unban' },
        { id: 'banls', text: '查看封禁列表', action: '/ban ls' }
      )
    if (this.config.runasCmdEnabled)
      btnList.push({ id: 'runas', text: '以指定玩家身份运行命令', action: '/manger runas' })
    if (this.config.stopCmdEnabled) btnList.push({ id: 'stop', text: '关闭服务器', action: '/stops' })

    const mangerCmd = this.cmd('manger', '管理服务器', PermType.GameMasters)
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
            title: '踢出玩家',
            buttons: mc.getOnlinePlayers().map((pl) => ({ text: pl.realName, action: `/skick "${pl.realName}"` }))
          })
          break
        case 'crash':
          Gui.send(pl, {
            title: '强制崩玩家',
            buttons: mc.getOnlinePlayers().map((pl) => ({ text: pl.realName, action: `/crashes "${pl.realName}"` }))
          })
          break
        case 'info':
          Gui.send(pl, {
            title: '获取玩家信息',
            buttons: mc.getOnlinePlayers().map((pl) => ({ text: pl.realName, action: `/info "${pl.realName}"` }))
          })
          break
        case 'ban':
          Gui.send(pl, {
            type: 'custom',
            title: '封禁玩家',
            elements: [
              { title: '目标玩家', type: 'dropdown', items: '@players' },
              { title: '封禁 IP', type: 'switch', default: false },
              { title: '选填：封禁时长（秒）', type: 'input' },
              { title: '选填：封禁原因', type: 'input' }
            ],
            action: (pl: Player, player: string, banip: Boolean, time?: number, reason?: string) =>
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
            title: '解除封禁',
            buttons: Object.entries(DATA.get('bans')).map(([name, data]) => ({
              text: name,
              action: `/ban unban "${name}"`
            }))
          })

          break
        case 'runas':
          Gui.send(pl, {
            type: 'custom',
            title: '以指定玩家身份运行命令',
            elements: [
              { title: '目标玩家', type: 'dropdown', items: '@players' },
              { title: '运行指令', type: 'input' }
            ],
            action: '/runas "{0}" "{1}"'
          })
          break
        default:
          Gui.send(pl, { title: '管理服务器', onlyOp: true, buttons: btnList })
      }
    })
  }

  private vanish() {
    const vanishCmd = this.cmd('vanish', '使自己隐身', PermType.GameMasters)
    vanishCmd.overload([])
    vanishCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return
      if (pl.getAllEffects().find((id) => id === 14)) {
        pl.removeEffect(14)
        out.success('已取消隐身状态')
        return
      }
      pl.addEffect(14, 9 * 10 ** 8, 225, false)
      out.success('已设置隐身状态')
    })
  }

  private runas() {
    const runasCmd = this.cmd('runas', '以指定玩家身份运行命令', PermType.GameMasters)

    runasCmd.mandatory('player', ParamType.String)
    runasCmd.mandatory('command', ParamType.String)
    runasCmd.overload(['player', 'command'])

    runasCmd.setCallback((_, __, out, { player, command }) => {
      const target = mc.getPlayer(player)
      if (!target) {
        out.error('目标玩家不在线')
        return
      }
      target.runcmd(command)
      out.success(`命令已发送给 ${target.realName}`)
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
      pl.kick(
        `${name in allBans ? '你' : `当前 IP（${ip}）`}已被服务器封禁${time !== 0 ? `到 ${time.toLocaleString()}` : '永久'}${reason ? `\n原因：${reason}` : ''}`
      )
      logger.warn(`玩家 ${pl.realName} 存在于本地黑名单中，已被踢出`)
    }

    const banCmd = this.cmd('ban', '封禁玩家', PermType.GameMasters)
    banCmd.setEnum('ListAction', ['ls'])
    banCmd.setEnum('UnbanAction', ['unban'])
    banCmd.setEnum('BanAction', ['ban', 'banip'])
    banCmd.mandatory('action', ParamType.Enum, 'ListAction', 1)
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
        if (Object.keys(allBans).length === 0) return out.success('当前封禁列表为空')
        return out.success(
          `当前封禁列表:\n ${Object.entries(allBans)
            .map(
              ([key, data]) =>
                `${key.includes('.') ? 'IP' : '玩家'}：${key} 时间：${new Date(data.time).toLocaleString()}${data.reason ? ` 原因：${data.reason}` : ''}`
            )
            .join('\n')}`
        )
      }

      const { player, time, reason } = result

      if (result.action === 'unban') {
        if (!allBans[player]) return out.error(`目标 ${player} 不在封禁列表`)
        delete allBans[player]
        return out.success(`已解除 ${player} 的封禁`)
      }

      const endTime = new Date(Date.now() + time * 1000)
      const targetPl = mc.getPlayer(player)
      if (result.action === 'banip' && !targetPl) return out.error('目标玩家不在线')
      allBans[result.action === 'banip' ? targetPl.getDevice().ip : player.toLowerCase()] = {
        time: time ? endTime.getTime() : 0,
        reason
      }

      if (targetPl) banKick(targetPl)
      return out.success(
        `已封禁 ${player}${result.action === 'banip' ? `（IP：${targetPl.getDevice().ip}）` : ''} ${time ? `到 ${endTime.toLocaleString()}` : '永久'} ${reason ? ` 原因：${reason}` : ''}`
      )
    })

    setTimeout(() => mc.getOnlinePlayers().forEach((pl) => banKick(pl)), 10 * 1000)
    mc.listen('onPreJoin', (pl) => pl && banKick(pl))
  }

  private cloudBlackCheck() {
    mc.listen('onPreJoin', (pl) => {
      network.httpGet(
        `https://api.blackbe.work/openapi/v3/check/?name=${pl.realName}&xuid=${pl.xuid}`,
        (status, result) => {
          if (status !== 200) return logger.error('云黑接口请求失败，请检查你的网络连接')
          if (JSON.parse(result).status !== 2000) return
          pl.kick('你已被列入 BlackBe 云黑名单，如有疑问请联系管理员')
          logger.warn(`玩家 ${pl.realName} 已被列入 BlackBe 云黑名单`)
        }
      )
    })
  }

  private skick() {
    const skickCmd = this.cmd('skick', '强制踢除玩家', PermType.GameMasters)
    skickCmd.mandatory('target', ParamType.String)
    skickCmd.optional('reason', ParamType.String)
    skickCmd.overload(['target', 'reason'])
    skickCmd.setCallback((_, __, out, { target, reason }) =>
      mc
        .getOnlinePlayers()
        .filter((pl) => pl.realName.toLowerCase().startsWith(target.toLowerCase()))
        .forEach((pl) => pl.kick(reason) && out.success(`已踢除 ${pl.realName}`))
    )
  }

  private crash() {
    const crashCmd = this.cmd('crashes', '强制崩玩家客户端', PermType.GameMasters)
    crashCmd.mandatory('player', ParamType.String)
    crashCmd.overload(['player'])
    crashCmd.setCallback((_, __, out, { player }) =>
      mc.getPlayer(player)
        ? mc.getPlayer(player).crash()
          ? out.success('客户端崩溃成功')
          : out.error('客户端崩溃失败')
        : out.error('目标玩家不在线')
    )
  }

  private stop() {
    const stopCmd = this.cmd('stops', '关闭服务器', PermType.GameMasters)
    stopCmd.overload([])
    stopCmd.setCallback((_, __, out) => mc.runcmd('stop'))
  }

  private info() {
    const infoCmd = this.cmd('info', '获取玩家信息', PermType.GameMasters)
    infoCmd.mandatory('player', ParamType.String)
    infoCmd.overload(['player'])

    infoCmd.setCallback((_, __, out, { player }) => {
      const target = mc.getPlayer(player)
      if (!target) {
        out.error('目标玩家不在线')
        return
      }

      target.getDevice()
      out.success(
        `玩家名：${target.realName}\nXUID：${target.xuid}\nUUID：${target.uuid}\nIP：${target.getDevice().ip}\n系统：${target.getDevice().os}\n输入模式：${target.getDevice().inputMode}\n延迟：${target.getDevice().avgPing}ms\n丢包率：${target.getDevice().avgPacketLoss}%\n连接地址：${target.getDevice().serverAddress}\n客户端 ID：${target.getDevice().clientId}`
      )
    })
  }
}
