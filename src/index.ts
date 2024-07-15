// import './constants/template'
import './constants/constants'
import pkg from '../package.json'
import Gui from './components/Gui/index'
import Helper from './components/Helper/index'
import Land from './components/Land/index'
import Manger from './components/Manger/index'
import Money from './components/Money/index'
import Teleport from './components/Teleport/index'
import Utils from './components/Utils/index'
import { CONFIG, DATA, PLUGIN_NAME, PLUGIN_VERSION, UPDATE } from './constants/constants'
import Component from './utils/component'
import Loader from './utils/loader'
import t, { PLUGIN_DESCRIPTION } from './utils/t'

class SiriusApi extends Component<object> {
  public register() {
    const siriusCmd = this.cmd('sirius', t`cmd.sirius.description`, PermType.GameMasters)
    siriusCmd.setEnum('Action', ['version', 'reload'])
    siriusCmd.mandatory('action', ParamType.Enum, 'Action', 1)
    siriusCmd.overload(['action'])
    siriusCmd.setCallback((_, __, out, { action }) => {
      switch (action) {
        case 'reload':
          DATA.reload()
          return out.success(t`cmd.sirius.msg.reload`)
        default:
          return out.success(
            t('cmd.sirius.msg.version', PLUGIN_DESCRIPTION, PLUGIN_VERSION, pkg.author, pkg.homepage, pkg.license)
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
    ['manger', Manger],
    ['money', Money],
    ['land', Land]
  ],
  () => {
    // Check update
    network.httpGet(UPDATE.META, (status, data) => {
      if (status !== 200) return logger.error(t`update.msg.error`)
      const res = JSON.parse(data)
      if (res.version === pkg.version) return null
      logger.warn(t('update.msg.new', res.version, pkg.version, UPDATE.REPO))
    })

    // Record xuids
    mc.listen('onJoin', ({ xuid, realName }) => {
      const xuids = DATA.get('xuids')
      if (!(xuid in xuids)) xuids[xuid] = realName
    })
  }
)

export default Plugin
