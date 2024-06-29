import pkg from '../package.json';
import Gui from './components/Gui/index';
import Helper from './components/Helper/index';
import Teleport from './components/Teleport/index';
import { CONFIG, DATA } from './constants';
import Loader from './utils/loader';

const Plugin = new Loader(
  Object.assign(pkg, {
    name: `${pkg.name.charAt(0).toUpperCase()}${pkg.name.slice(1)}`,
    description: '基础性插件',
    version: pkg.version.split('.').map(Number)
  }),
  CONFIG,
  [
    ['gui', Gui],
    ['helper', Helper],
    ['teleport', Teleport]
  ],
  () => {
    mc.listen('onJoin', ({ xuid, realName }) => {
      const xuids = DATA.get('xuids');
      if (!(xuid in xuids)) xuids[xuid] = realName;
    });
  }
);

export default Plugin;
