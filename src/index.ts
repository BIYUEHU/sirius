import pkg from '../package.json';

ll.registerPlugin(`${pkg.name.charAt(0).toUpperCase()}${pkg.name.slice(1)}`, '基础性插件', pkg.version.split('.'), {
  ...(pkg.author ? { author: pkg.author } : {}),
  ...(pkg.license ? { license: pkg.license } : {}),
  ...(pkg.repository ? { repository: pkg.repository } : {})
});

logger.info(`Sirius Loaded v${pkg.version}`);
