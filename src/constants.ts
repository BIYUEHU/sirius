export const PLUGIN_PATH = './plugins/Sirius';

export const DATA_PATH = `${PLUGIN_PATH}/data`;

export const GUI_PATH = `${PLUGIN_PATH}/gui`;

export const CONF_FILE = `${PLUGIN_PATH}/config.json`;

export const META = {
  name: 'Sirius',
  description: '基础性插件',
  version: [1, 0, 0],
  author: 'Arimura',
  license: 'GPL-3.0',
  repository: 'https://github.com/biyuehu/sirius'
} as const;
