import { CONFIG, Config } from '../../constants'
import Component from '../../utils/component'
import Gui from '../Gui/index'

export default class Money extends Component<Config['money']> {
  public register() {
    if (!money) {
      logger.error('当前未安装 LLMoney')
      return
    }
    if (this.config.hunterEnabled) this.hunter()
    if (this.config.shopCmdEnabled) this.shopCmd()
  }

  private hunter() {
    mc.listen('onMobDie', (mob, source) => {
      if (!source.isPlayer()) return
      const pl = mc.getPlayer(source.name)
      if (!pl) return
      const list = CONFIG.get('hunter')
      if (list.length === 0) return
      logger.info(`mob ${mob.type} died, hunter enabled`)
      const hunter = list.find((h) => h.entityId === mob.type)
      if (!hunter) return
      const price = Array.isArray(hunter.price)
        ? Math.floor(Math.random() * (hunter.price[1] - hunter.price[0] + 1 + hunter.price[0])) + hunter.price[0]
        : hunter.price
      money.add(pl.xuid, price)
      pl.tell(`击杀 ${mob.type}，获得了 ${price} 金币`)
    })
  }

  private shopCmd() {
    const shopCmd = this.cmd('shop', '商店系统', PermType.Any)
    shopCmd.overload([])
    shopCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return
      const list = CONFIG.get('shop')
      if (Object.keys(list).length === 0) return out.success('商店暂时没有任何商品')
      Gui.send(pl, {
        title: '商店列表',
        buttons: Object.entries(list).map(([text, items]) => ({
          text,
          action: () => {
            Gui.send(pl, {
              title: `§6商店§r：${text}`,
              buttons: items.map(({ icon, price, type, itemId, text, count }) => ({
                icon,
                text: `${type === 'buy' ? '§c购买' : '§b出售'}§r：${text}${count && count > 1 ? ` x ${count}` : ''} - §e${price} 金币§r`,
                action: () => {
                  const item = mc.newItem(itemId, count ?? 1)
                  if (!item) return logger.error(`错误的物品标识符 ${itemId}`)
                  if (type === 'buy') {
                    if (money.get(pl.xuid) < price) return pl.tell(`§c没有足够的金币 ${price}！`)
                    money.reduce(pl.xuid, price)
                    pl.giveItem(item)
                    return pl.tell(`成功购买了 ${text}${count && count > 1 ? ` x ${count}` : ''}，消费了 ${price} 金币`)
                  }

                  const realityCount = pl.clearItem(itemId, count ?? 1)
                  if (realityCount < (count ?? 1)) {
                    pl.giveItem(item, realityCount)
                    return pl.tell(`§c你没有足够的 ${text}！`)
                  }

                  money.add(pl.xuid, price)
                  return pl.tell(`成功出售了 ${text}${count && count > 1 ? ` x ${count}` : ''}，获得了 ${price} 金币`)
                }
              }))
            })
          }
        }))
      })
    })
  }
}
