import pkg from '../package.json'
import Gui from './components/Gui/index'
import Helper from './components/Helper/index'
import Manger from './components/Manger/index'
import Teleport from './components/Teleport/index'
import Utils from './components/Utils/index'
import { CONFIG, DATA, PLUGIN_DESCRIPTION, PLUGIN_NAME, PLUGIN_VERSION, UPDATE } from './constants'
import Component from './utils/component'
import Loader from './utils/loader'

class SiriusApi extends Component<{}> {
  public register() {
    const siriusCmd = this.cmd('sirius', 'Sirius 插件管理', PermType.GameMasters)
    siriusCmd.setEnum('Action', ['version', 'reload'])
    siriusCmd.mandatory('action', ParamType.Enum, 'Action', 1)
    siriusCmd.overload(['action'])
    siriusCmd.setCallback((_, __, out, { action }) => {
      switch (action) {
        case 'reload':
          DATA.reload()
          return out.success('插件数据重载成功')
        default:
          return out.success(
            `§l§9Sirius§r - §2${PLUGIN_DESCRIPTION}\n§r当前版本：§l§a${PLUGIN_VERSION}\n§r项目作者：§l§b${pkg.author}\n§r开原地址：§l§3${pkg.homepage}\n§r开源协议：§l§c${pkg.license}\n§r`
          )
      }
    })
  }
}

const Plugin = new Loader(
  Object.assign(pkg, {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    description: PLUGIN_DESCRIPTION
  }),
  CONFIG,
  [
    ['sirius', SiriusApi],
    ['gui', Gui],
    ['helper', Helper],
    ['teleport', Teleport],
    ['utils', Utils],
    ['manger', Manger]
  ],
  () => {
    // Check update
    network.httpGet(UPDATE.META, (status, data) => {
      if (status !== 200) return logger.error('无法获取更新信息，请检查网络连接')
      const res = JSON.parse(data)
      if (res.version === pkg.version) return null
      logger.warn(`发现新版本 ${res.version}，当前版本 ${pkg.version}，请前往 ${UPDATE.REPO} 获取最新版本`)
    })

    // Record xuids
    mc.listen('onJoin', ({ xuid, realName }) => {
      const xuids = DATA.get('xuids')
      if (!(xuid in xuids)) xuids[xuid] = realName
    })
  }
)

export default Plugin
