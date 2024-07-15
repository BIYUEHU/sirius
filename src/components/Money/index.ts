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
    this.moneys()
    if (this.config.hunterEnabled) this.hunter()
    if (this.config.shopCmdEnabled) this.shopCmd()
  }

  private moneys() {
    const moneysCmd = this.cmd('moneys', t`cmd.moneys.description`, PermType.Any)
    moneysCmd.setEnum('Action', ['pay'])
    moneysCmd.mandatory('action', ParamType.Enum, 'Action', 1)
    moneysCmd.overload(['Action'])
    moneysCmd.setCallback((_, { player: pl }, out, result) => {
      if (!pl) return
      if (result.action === 'pay') {
        return Gui.send(pl, {
          type: 'custom',
          title: t`gui.money.pay.title`,
          elements: [
            { type: 'dropdown', title: t`gui.money.pay.dropdown`, items: '@players' },
            { type: 'input', title: t`gui.money.pay.input` }
          ],
          action: (_, target, input) => {
            const targetPl = mc.getPlayer(target)
            if (!targetPl) return out.error(t`gui.money.pay.error.target_not_found`)
            const price = Number.parseInt(input)
            if (!price) return out.error(t`gui.money.pay.error.empty`)
            if (Number.isNaN(price)) return out.error(t`gui.money.pay.error.not_number`)
            if (Number(price) <= 0) return out.error(t`gui.money.pay.error.not_positive`)
            if (money.get(pl.xuid) < price) return out.error(t`gui.money.pay.error.not_enough_money`)
            money.reduce(pl.xuid, price)
            money.add(targetPl.xuid, price)
            out.success(t('gui.money.pay.success', targetPl.realName, String(price)))
            targetPl.tell(t('gui.money.pay.target_received', pl.realName, String(price)))
          }
        })
      }
    })
  }

  private hunter() {
    mc.listen('onMobDie', (mob, source) => {
      if (!source || !source.isPlayer()) return
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
                  String(count ?? 1),
                  String(price)
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
                  return pl.tell(t('cmd.shop.msg.sell', text, String(count ?? 1), String(price)))
                }
              }))
            })
          }
        }))
      })
    })
  }
}
