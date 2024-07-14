import { CONFIG, type Config } from '../../constants/constants'
import Component from '../../utils/component'
import t from '../../utils/t'
import Gui from '../Gui/index'

export default class Money extends Component<Config['money']> {
  public register() {
    if (!money) {
      logger.error(t`info.money_not_found`)
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
      const hunter = list.find((h) => h.entityId === mob.type)
      if (!hunter) return
      const price = Array.isArray(hunter.price)
        ? Math.floor(Math.random() * (hunter.price[1] - hunter.price[0] + 1 + hunter.price[0])) + hunter.price[0]
        : hunter.price
      money.add(pl.xuid, price)
      pl.tell(t('info.hunter', mob.type, String(price)))
    })
  }

  private shopCmd() {
    const shopCmd = this.cmd('shop', t`cmd.shop.description`, PermType.Any)
    shopCmd.overload([])
    shopCmd.setCallback((_, { player: pl }, out) => {
      if (!pl) return
      const list = CONFIG.get('shop')
      if (Object.keys(list).length === 0) return out.success(t`cmd.shop.msg.empty`)
      Gui.send(pl, {
        title: t`gui.shop.title`,
        buttons: Object.entries(list).map(([text, items]) => ({
          text,
          action: () => {
            Gui.send(pl, {
              title: t('gui.shop.item_list.title', text),
              buttons: items.map(({ icon, price, type, itemId, text, count }) => ({
                icon,
                text: t(
                  'gui.shop.item_list.item',
                  type === 'buy' ? 'gui.shop.item_list.buy' : 'gui.shop.item_list.sell',
                  text,
                  String(count)
                ),
                action: () => {
                  const item = mc.newItem(itemId, count ?? 1)
                  if (!item) return logger.error(t('cmd.shop.msg.item_not_found', itemId))
                  if (type === 'buy') {
                    if (money.get(pl.xuid) < price) return pl.tell(t('cmd.shop.msg.not_enough_money', String(price)))
                    money.reduce(pl.xuid, price)
                    pl.giveItem(item)
                    return pl.tell(t('cmd.shop.msg.buy', text, String(count), String(price)))
                  }

                  const realityCount = pl.clearItem(itemId, count ?? 1)
                  if (realityCount < (count ?? 1)) {
                    pl.giveItem(item, realityCount)
                    return pl.tell(t('cmd.shop.msg.not_enough_item', text))
                  }

                  money.add(pl.xuid, price)
                  return pl.tell(t('cmd.shop.msg.sell', text, String(count), String(price)))
                }
              }))
            })
          }
        }))
      })
    })
  }
}
