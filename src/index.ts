import pkg from '../package.json';
import Gui from './components/Gui/index';
import Helper from './components/Helper/index';
import Teleport from './components/Teleport/index';
import { CONFIG, DATA, UPDATE } from './constants';
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
    ['helper', Helper]
    // ['teleport', Teleport]
  ],
  () => {
    // Check update
    network.httpGet(UPDATE.META, (status, data) => {
      if (status !== 200) return logger.error('无法获取更新信息，请检查网络连接');
      const res = JSON.parse(data);
      if (res.version === pkg.version) return null;
      logger.warn(`发现新版本 ${res.version}，当前版本 ${pkg.version}，请前往 ${UPDATE.REPO} 获取最新版本`);
    });

    // Record xuids
    mc.listen('onJoin', ({ xuid, realName }) => {
      const xuids = DATA.get('xuids');
      if (!(xuid in xuids)) xuids[xuid] = realName;
    });
  }
);

export default Plugin;
