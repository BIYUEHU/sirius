import { set } from 'shelljs'
import { Config, DATA, Data } from '../../constants'
import Component from '../../utils/component'
import { ObjPosToStr, ObjToPos, PosToObj } from '../../utils/position'
import Gui from '../Gui/index'

type Position = ReturnType<typeof PosToObj>

type Area = [Position, Position]

function* edgePositions(area: Area): Generator<Position> {
  const [start, end] = area
  const dimension = start.dimension

  const [minX, maxX] = [Math.min(start.x, end.x), Math.max(start.x, end.x)]
  const [minY, maxY] = [Math.min(start.y, end.y), Math.max(start.y, end.y)]
  const [minZ, maxZ] = [Math.min(start.z, end.z), Math.max(start.z, end.z)]

  for (let x = minX; x <= maxX; x++) {
    yield { dimension, x, y: minY, z: minZ }
    yield { dimension, x, y: maxY, z: minZ }
    yield { dimension, x, y: minY, z: maxZ }
    yield { dimension, x, y: maxY, z: maxZ }
  }

  for (let y = minY + 1; y < maxY; y++) {
    yield { dimension, x: minX, y, z: minZ }
    yield { dimension, x: maxX, y, z: minZ }
    yield { dimension, x: minX, y, z: maxZ }
    yield { dimension, x: maxX, y, z: maxZ }
  }

  for (let z = minZ + 1; z < maxZ; z++) {
    yield { dimension, x: minX, y: minY, z }
    yield { dimension, x: maxX, y: minY, z }
    yield { dimension, x: minX, y: maxY, z }
    yield { dimension, x: maxX, y: maxY, z }
  }
}

export default class Land extends Component<Config['land']> {
  public register() {
    this.land()
  }

  private readonly createLandRunning: Map<string, { name: string; a?: Position; b?: Position }> = new Map()

  private readonly locatedLandData: Map<string, Data['lands'][string][string]> = new Map()

  private hasIntersection(area1: Area, area2: Area) {
    if (area1[0].dimension !== area2[0].dimension) return false
    return !(
      area1[1].x < area2[0].x ||
      area1[0].x > area2[1].x ||
      area1[1].y < area2[0].y ||
      area1[0].y > area2[1].y ||
      area1[1].z < area2[0].z ||
      area1[0].z > area2[1].z
    )
  }

  private isPositionInArea([start, end]: Area, position: Position): boolean {
    if (start.dimension !== position.dimension) return false
    const [minX, maxX] = [Math.min(start.x, end.x), Math.max(start.x, end.x)]
    const [minY, maxY] = [Math.min(start.y, end.y), Math.max(start.y, end.y)]
    const [minZ, maxZ] = [Math.min(start.z, end.z), Math.max(start.z, end.z)]
    return (
      position.x >= minX &&
      position.x <= maxX &&
      position.y >= minY &&
      position.y <= maxY &&
      position.z >= minZ &&
      position.z <= maxZ
    )
  }

  private calculateBlockCount([start, end]: Area) {
    const [minX, maxX] = [Math.min(start.x, end.x), Math.max(start.x, end.x)]
    const [minY, maxY] = [Math.min(start.y, end.y), Math.max(start.y, end.y)]
    const [minZ, maxZ] = [Math.min(start.z, end.z), Math.max(start.z, end.z)]
    return (Math.abs(maxX - minX) + 1) * (Math.abs(maxY - minY) + 1) * (Math.abs(maxZ - minZ) + 1)
  }

  private getLocatedLand(pos: FloatPos) {
    const allLands = DATA.get('lands')
    for (const ownerXuid in allLands) {
      for (const landName in allLands[ownerXuid]) {
        const land = allLands[ownerXuid][landName]
        if (!this.isPositionInArea([land.start, land.end], PosToObj(pos))) continue
        return [ownerXuid, landName, land] as const
      }
    }
    return null
  }

  private clearCreateLandRunning(pl: Player) {
    const info = this.createLandRunning.get(pl.xuid)
    if (!info) return
    this.createLandRunning.delete(pl.xuid)
  }

  private catchPlayerEvent(pl: Player, pos: IntPos) {
    const landData = this.getLocatedLand(pos)
    if (!landData) return true
    if (landData[0] === pl.xuid) return true
    return false
  }

  private land() {
    mc.listen('onLeft', (pl) => this.clearCreateLandRunning(pl))
    mc.listen('onChangeDim', (pl) => this.clearCreateLandRunning(pl))

    setInterval(() => {
      mc.getOnlinePlayers().forEach((pl) => {
        const locatedLandCurrent = this.getLocatedLand(pl.feetPos)
        const locatedLandLast = this.locatedLandData.get(pl.xuid)
        const [ownerXuid, landName, land] = locatedLandCurrent ?? []

        if (locatedLandCurrent) pl.tell(`当前位于 ${ownerXuid ? this.getPlayerName(ownerXuid) : '???'} 的领地`, 4)
        if ((locatedLandCurrent && locatedLandLast) || (!locatedLandCurrent && !locatedLandLast)) return
        if (locatedLandCurrent && !locatedLandLast) {
          if (land!.welcomeMsg) pl.setTitle(land!.welcomeMsg, 2)
          else pl.tell(`你已进入领地 ${landName}`)
          return this.locatedLandData.set(pl.xuid, land!)
        }
        if (!locatedLandCurrent && locatedLandLast) {
          if (locatedLandLast.leaveMsg) pl.tell(locatedLandLast.leaveMsg)
          return this.locatedLandData.delete(pl.xuid)
        }
      })

      this.createLandRunning.forEach((info) => {
        if (!info.a || !info.b) return
        for (const pos of edgePositions([info.a, info.b])) {
          mc.spawnParticle(pos.x, pos.y, pos.z, pos.dimension, 'minecraft:villager_happy')
        }
      })
    }, 500)

    mc.listen('onAttackBlock', (pl, block) => this.catchPlayerEvent(pl, block.pos))
    mc.listen('onUseBucketPlace', (pl, __, ___, _____, pos) => this.catchPlayerEvent(pl, pos))
    mc.listen('onTakeItem', (pl, entity) => this.catchPlayerEvent(pl, entity.pos))
    mc.listen('onDestroyBlock', (pl, block) => this.catchPlayerEvent(pl, block.pos))
    mc.listen('afterPlaceBlock', (pl, block) => this.catchPlayerEvent(pl, block.pos))
    // mc.listen('onSetArmor', (pl) => this.catchPlayerEvent(pl, pl.pos))
    mc.listen('onBedEnter', (pl, pos) => this.catchPlayerEvent(pl, pos))

    const landCmd = this.cmd('land', '领地系统', PermType.Any)
    landCmd.setEnum('RequestAction', ['tp'])
    landCmd.setEnum('SetAction', ['set'])
    landCmd.setEnum('ResponseAction', ['new', 'buy', 'giveup', 'gui'])
    landCmd.setEnum('Point', ['a', 'b'])
    landCmd.mandatory('action', ParamType.Enum, 'RequestAction', 1)
    landCmd.mandatory('action', ParamType.Enum, 'SetAction', 1)
    landCmd.mandatory('action', ParamType.Enum, 'ResponseAction', 1)
    landCmd.mandatory('point', ParamType.Enum, 'Point', 1)
    landCmd.mandatory('name', ParamType.String)
    landCmd.overload(['ResponseAction'])
    landCmd.overload(['RequestAction', 'name'])
    landCmd.overload(['SetAction', 'Point'])
    landCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return
      const allLands = DATA.get('lands')
      if (!(pl.xuid in allLands)) allLands[pl.xuid] = {}
      const lands = allLands[pl.xuid]

      if (result.action === 'tp') {
        if (!(result.name in lands)) return out.error('没有与目标匹配的领地')
        pl.teleport(ObjToPos(lands[result.name].start))
        return out.success(`成功传送到领地 ${result.name}`)
      }

      if (result.action === 'new') {
        if (this.createLandRunning.has(pl.xuid)) {
          return out.error('当前正在进行领地创建中，如若需要重新创建请先发送 /land giveup')
        }
        return Gui.send(pl, {
          type: 'custom',
          title: '创建领地',
          elements: [{ type: 'input', title: '领地名称' }],
          action: (_, name) => {
            if (!name) return pl.tell('§c请输入领地名称')
            if (name in lands) return pl.tell('§c已经有同名的领地')
            this.createLandRunning.set(pl.xuid, { name })
            return pl.tell('开始领地创建中，请发送 /land set a 设置领地起始坐标点')
          }
        })
      }

      if (['giveup', 'buy', 'set'].includes(result.action)) {
        if (!this.createLandRunning.has(pl.xuid)) return out.error('当前没有正在进行的领地创建')

        const info = this.createLandRunning.get(pl.xuid)!
        /* Buy action part one */
        if (result.action === 'buy' && (!info.a || !info.b)) return out.error('当前领地创建选点还未设置完成')

        /* Other actions parts */
        if (result.action === 'set') {
          const feetPos = PosToObj(pl.feetPos)
          info[result.point as 'a' | 'b'] = feetPos
          if (result.point === 'a') return out.success(`已设置领地起始坐标点 ${ObjPosToStr(feetPos)}`)
          if (result.point === 'b') return out.success(`已设置领地结束坐标点 ${ObjPosToStr(feetPos)}`)
        }

        this.createLandRunning.delete(pl.xuid)
        if (result.action === 'giveup') return out.success('已放弃领地创建')

        /* Buy action part two */
        for (const list of Object.values(allLands)) {
          for (const item of Object.values(list)) {
            if (!this.hasIntersection([info.a!, info.b!], [item.start, item.end])) continue
            return out.error('领地创建失败，选定的领地与已有领地有交叉，请重新创建')
          }
        }

        const blockCount = this.calculateBlockCount([info.a!, info.b!])
        if (blockCount > this.config.maxBlockCount)
          return out.error(`领地创建失败，领地大小超过 ${this.config.maxBlockCount} 块`)

        const price = blockCount * this.config.buyPrice
        if (money.get(pl.xuid) < price) return out.error(`领地创建失败，没有足够的金币 ${price}`)

        money.reduce(pl.xuid, price)
        lands[info.name] = { start: info.a!, end: info.b!, allowlist: [], leaveMsg: '', welcomeMsg: '' }
        return out.success(`领地 ${info.name} 创建成功，花费 ${price} 金币`)
      }

      if (Object.keys(lands).length === 0) return out.error('当前没有任何领地')

      return Gui.send(pl, {
        title: '领地管理',
        buttons: Object.entries(lands).map(([text, land]) => ({
          text,
          action: () =>
            Gui.send(pl, {
              title: `领地：${text} 管理`,
              content: `起始坐标：${ObjPosToStr(land.start)}\n结束坐标：${ObjPosToStr(land.end)}`,
              buttons: [
                {
                  text: '添加白名单',
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: `领地：${text} 添加白名单`,
                      elements: [{ type: 'dropdown', items: '@players', title: '选择玩家' }],
                      action: (_, target) => {
                        const targetPl = mc.getPlayer(target)
                        if (!targetPl) return pl.tell('§c目标玩家不在线')
                        if (targetPl.xuid in lands[text].allowlist) return pl.tell('§c该玩家已经在白名单中')
                        lands[text].allowlist.push(targetPl.xuid)
                        return pl.tell('玩家已添加到白名单')
                      }
                    })
                },
                { text: '传送至领地', action: `/land tp "${text}"` },
                {
                  text: '设置欢迎语',
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: `领地：${text} 设置欢迎语`,
                      elements: [{ type: 'input', title: '欢迎语', default: land.welcomeMsg }],
                      action: (_, msg) => {
                        lands[text].welcomeMsg = msg
                        return pl.tell('欢迎语已设置')
                      }
                    })
                },
                {
                  text: '设置离开语',
                  action: (pl, msg) =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: `领地：${text} 设置离开语`,
                      elements: [{ type: 'input', title: '离开语', default: land.leaveMsg }],
                      action: (_, msg) => {
                        lands[text].leaveMsg = msg
                        return pl.tell('离开语已设置')
                      }
                    })
                },
                {
                  text: '重命名领地',
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: `领地：${text} 重命名`,
                      elements: [{ type: 'input', title: '新的名称' }],
                      action: (_, name) => {
                        if (!name) return pl.tell('§c请输入新的名称')
                        if (name in lands) return pl.tell('§c已经有同名的领地')

                        lands[name] = lands[text]
                        delete lands[text]
                        return pl.tell(`领地已重命名为 ${name}`)
                      }
                    })
                },
                {
                  text: '转让领地',
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: `领地：${text} 转让`,
                      elements: [{ type: 'dropdown', items: '@players', title: '转让给' }],
                      action: (_, target) => {
                        const targetPl = mc.getPlayer(target)
                        if (!targetPl) return pl.tell('§c目标玩家不在线')
                        if (targetPl.xuid === pl.xuid) return pl.tell('§c不能转让给自己')

                        allLands[targetPl.xuid][`${text} 来自：${pl.name}`] = lands[text]
                        delete lands[text]
                        targetPl.tell(`玩家 ${pl.realName} 将领地 ${text} 已转让给你`)
                        return pl.tell(`领地已转让给玩家 ${targetPl.realName}`)
                      }
                    })
                },
                {
                  text: '删除领地',
                  action: () => {
                    const price = this.calculateBlockCount([land.start, land.end]) * this.config.destPrice

                    Gui.sendModal(
                      pl,
                      `领地：${text} 删除`,
                      `删除后将得将返还金币 ${price}，确定要删除该领地吗？`,
                      () => {
                        delete lands[text]
                        money.add(pl.xuid, price)
                        return pl.tell(`领地已删除，返还 ${price} 金币`)
                      }
                    )
                  }
                }
              ]
            })
        }))
      })
    })
  }
}
