import { type Config, DATA, type Data } from '../../constants/constants'
import Component from '../../utils/component'
import { ObjPosToStr, ObjToPos, PosToObj } from '../../utils/position'
import Gui from '../Gui/index'
import t, { tp } from '../../utils/t'

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
      for (const pl of mc.getOnlinePlayers()) {
        const locatedLandCurrent = this.getLocatedLand(pl.feetPos)
        const locatedLandLast = this.locatedLandData.get(pl.xuid)
        const [ownerXuid, landName, land] = locatedLandCurrent ?? []

        if (locatedLandCurrent) pl.tell(t('land.current_location', this.getPlayerName(ownerXuid ?? '???')), 4)
        if ((locatedLandCurrent && locatedLandLast) || (!locatedLandCurrent && !locatedLandLast)) return
        if (locatedLandCurrent && !locatedLandLast && land) {
          if (land.welcomeMsg) pl.setTitle(tp(land.welcomeMsg, pl), 2)
          else pl.tell(t('land.enter', String(landName ?? '???')))
          return this.locatedLandData.set(pl.xuid, land)
        }
        if (!locatedLandCurrent && locatedLandLast) {
          if (locatedLandLast.leaveMsg) pl.tell(tp(locatedLandLast.leaveMsg, pl))
          return this.locatedLandData.delete(pl.xuid)
        }
      }

      for (const info of this.createLandRunning.values()) {
        if (!info.a || !info.b) continue
        for (const pos of edgePositions([info.a, info.b])) {
          mc.spawnParticle(pos.x, pos.y, pos.z, pos.dimension, 'minecraft:villager_happy')
        }
      }
    }, 500)

    mc.listen('onAttackBlock', (pl, block) => this.catchPlayerEvent(pl, block.pos))
    mc.listen('onUseBucketPlace', (pl, __, ___, _____, pos) => this.catchPlayerEvent(pl, pos))
    mc.listen('onTakeItem', (pl, entity) => this.catchPlayerEvent(pl, entity.pos))
    mc.listen('onDestroyBlock', (pl, block) => this.catchPlayerEvent(pl, block.pos))
    mc.listen('afterPlaceBlock', (pl, block) => this.catchPlayerEvent(pl, block.pos))
    mc.listen('onBedEnter', (pl, pos) => this.catchPlayerEvent(pl, pos))

    const landCmd = this.cmd('land', t`cmd.land.description`, PermType.Any)
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
        if (!(result.name in lands)) return out.error(t`land.error.not_found`)
        pl.teleport(ObjToPos(lands[result.name].start))
        return out.success(t('land.teleport.success', result.name))
      }

      if (result.action === 'new') {
        if (this.createLandRunning.has(pl.xuid)) {
          return out.error(t`land.error.creation_in_progress`)
        }
        return Gui.send(pl, {
          type: 'custom',
          title: t`gui.land.create.title`,
          elements: [{ type: 'input', title: t`gui.land.create.name` }],
          action: (_, name) => {
            if (!name) return pl.tell(t`land.error.name_required`)
            if (name in lands) return pl.tell(t`land.error.name_exists`)
            this.createLandRunning.set(pl.xuid, { name })
            return pl.tell(t`land.create.start`)
          }
        })
      }

      if (['giveup', 'buy', 'set'].includes(result.action)) {
        if (!this.createLandRunning.has(pl.xuid)) return out.error(t`land.error.no_creation_in_progress`)

        const info = this.createLandRunning.get(pl.xuid) as { name: string; a?: Position; b?: Position }
        if (result.action === 'buy' && (!info.a || !info.b)) return out.error(t`land.error.incomplete_selection`)

        if (result.action === 'set') {
          const feetPos = PosToObj(pl.feetPos)
          info[result.point as 'a' | 'b'] = feetPos
          return out.success(t(`land.set.${result.point}`, ObjPosToStr(feetPos)))
        }

        this.createLandRunning.delete(pl.xuid)
        if (result.action === 'giveup') return out.success(t`land.create.giveup`)

        for (const list of Object.values(allLands)) {
          for (const item of Object.values(list)) {
            if (!this.hasIntersection([info.a as Position, info.b as Position], [item.start, item.end])) continue
            return out.error(t`land.error.intersection`)
          }
        }

        const blockCount = this.calculateBlockCount([info.a as Position, info.b as Position])
        if (blockCount > this.config.maxBlockCount)
          return out.error(t('land.error.too_large', String(this.config.maxBlockCount)))

        const price = blockCount * this.config.buyPrice
        if (money.get(pl.xuid) < price) return out.error(t('land.error.insufficient_funds', String(price)))

        money.reduce(pl.xuid, price)
        lands[info.name] = {
          start: info.a as Position,
          end: info.b as Position,
          allowlist: [],
          leaveMsg: '',
          welcomeMsg: ''
        }
        return out.success(t('land.create.success', info.name, String(price)))
      }

      if (Object.keys(lands).length === 0) return out.error(t`land.error.no_lands`)

      return Gui.send(pl, {
        title: t`gui.land.manage.title`,
        buttons: Object.entries(lands).map(([text, land]) => ({
          text,
          action: () =>
            Gui.send(pl, {
              title: t('gui.land.manage.land_title', text),
              content: t('gui.land.manage.land_info', ObjPosToStr(land.start), ObjPosToStr(land.end)),
              buttons: [
                {
                  text: t`gui.land.manage.add_whitelist`,
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: t('gui.land.manage.add_whitelist_title', text),
                      elements: [{ type: 'dropdown', items: '@players', title: t`gui.land.manage.select_player` }],
                      action: (_, target) => {
                        const targetPl = mc.getPlayer(target)
                        if (!targetPl) return pl.tell(t`land.error.player_offline`)
                        if (targetPl.xuid in lands[text].allowlist) return pl.tell(t`land.error.already_whitelisted`)
                        lands[text].allowlist.push(targetPl.xuid)
                        return pl.tell(t`land.whitelist.added`)
                      }
                    })
                },
                { text: t`gui.land.manage.teleport`, action: `/land tp "${text}"` },
                {
                  text: t`gui.land.manage.set_welcome`,
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: t('gui.land.manage.set_welcome_title', text),
                      elements: [
                        { type: 'input', title: t`gui.land.manage.welcome_message`, default: land.welcomeMsg }
                      ],
                      action: (_, msg) => {
                        lands[text].welcomeMsg = msg
                        return pl.tell(t`land.welcome.set`)
                      }
                    })
                },
                {
                  text: t`gui.land.manage.set_leave`,
                  action: (pl, msg) =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: t('gui.land.manage.set_leave_title', text),
                      elements: [{ type: 'input', title: t`gui.land.manage.leave_message`, default: land.leaveMsg }],
                      action: (_, msg) => {
                        lands[text].leaveMsg = msg
                        return pl.tell(t`land.leave.set`)
                      }
                    })
                },
                {
                  text: t`gui.land.manage.rename`,
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: t('gui.land.manage.rename_title', text),
                      elements: [{ type: 'input', title: t`gui.land.manage.new_name` }],
                      action: (_, name) => {
                        if (!name) return pl.tell(t`land.error.name_required`)
                        if (name in lands) return pl.tell(t`land.error.name_exists`)

                        lands[name] = lands[text]
                        delete lands[text]
                        return pl.tell(t('land.rename.success', name))
                      }
                    })
                },
                {
                  text: t`gui.land.manage.transfer`,
                  action: () =>
                    Gui.send(pl, {
                      type: 'custom',
                      title: t('gui.land.manage.transfer_title', text),
                      elements: [{ type: 'dropdown', items: '@players', title: t`gui.land.manage.transfer_to` }],
                      action: (_, target) => {
                        const targetPl = mc.getPlayer(target)
                        if (!targetPl) return pl.tell(t`land.error.player_offline`)
                        if (targetPl.xuid === pl.xuid) return pl.tell(t`land.error.self_transfer`)

                        allLands[targetPl.xuid][t('land.transfer.new_name', text, pl.name)] = lands[text]
                        delete lands[text]
                        targetPl.tell(t('land.transfer.received', pl.realName, text))
                        return pl.tell(t('land.transfer.success', text, targetPl.realName))
                      }
                    })
                },
                {
                  text: t`gui.land.manage.delete`,
                  action: () => {
                    const price = this.calculateBlockCount([land.start, land.end]) * this.config.destPrice

                    Gui.sendModal(
                      pl,
                      t('gui.land.manage.delete_title', text),
                      t('gui.land.manage.delete_confirm', String(price)),
                      () => {
                        delete lands[text]
                        money.add(pl.xuid, price)
                        return pl.tell(t('land.delete.success', String(price)))
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
