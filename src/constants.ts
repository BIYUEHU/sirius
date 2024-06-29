import AutoJsonConfigFile from './utils/autoJsonConfigFile';

export const PLUGIN_PATH = './plugins/Sirius';

export const DATA_PATH = `${PLUGIN_PATH}/data`;

export const GUI_PATH = `${PLUGIN_PATH}/gui`;

export const CONFIG_FILE = `${PLUGIN_PATH}/config.json`;

export const DATA_FILE = `${DATA_PATH}/data.json`;

export const NOTICE_FILE = `${DATA_PATH}/notice.txt`;

const CONFIG_DEFAULT = {
  global: {
    decode: true,
    lang: 'zh_CN' as 'en_US' | 'ja_JP' | 'zh_CN' | 'zh_TW'
  },
  utils: {
    enabled: true,
    joinWelcomeEnabled: true,
    joinWelcomeMsg: 'Welcome to the server, %player%!',
    motdDynastyEnabled: true,
    motdMsgs: ['server motd!'],
    motdInterval: 5,
    itemsUseOn: {
      'minecraft:clock': 'menu'
    } as Record<string, string>,
    chatFormatEnabled: true,
    chatFormat: '%player%: %message%'
  },
  helper: {
    enabled: true,
    noticeCmdEnabled: true,
    suicideCmdEnabled: true,
    backCmdEnabled: true,
    clockCmdEnabled: true,
    msguiCmdEnabled: true,
    hereCmdEnabled: true,
    vanishCmdEnabled: true,
    runasCmdEnabled: true,
    mapCmdEnabled: true
  },
  teleport: {
    enabled: true,
    tpaCmdEnabled: true,
    tpaExpireTime: 90,
    tprCmdEnabled: true,
    tprMaxDistance: 10000,
    tprMinDistance: 1000,
    tprSafeHeight: 120,
    homeCmdEnabled: true,
    homeMaxCount: 20,
    warpCmdEnabled: true,
    transferCmdEnabled: true
  },
  gui: {
    enabled: true,
    menuCmdEnabled: true,
    menuCmdAlias: 'cd'
  },
  manger: {
    enabled: true,
    banCmdEnabled: true,
    cloudBlackCheckEnabled: true,
    skickCmdEnabled: true,
    gcrashCmdEnabled: true,
    stopCmdEnabled: true,
    infoCmdEnabled: true,
    gameruleGuiEnabled: true
  },
  land: {
    enabled: true
  },
  money: {
    enabled: true,
    scoreboardName: 'money',
    syncLLMoney: true
  }
};

export type Config = typeof CONFIG_DEFAULT;

export const CONFIG = new AutoJsonConfigFile(CONFIG_FILE, CONFIG_DEFAULT);

interface Position {
  dimension: 0 | 1 | 2;
  x: number;
  y: number;
  z: number;
}

const DATA_DEFAULT = {
  xuids: {} as Record<string, String>,
  tpasEnableList: [] as string[],
  homes: {} as Record<string, Record<string, Position>>,
  warps: {} as Record<string, Position>,
  lands: {} as Record<string, Record<string, { start: Position; end: Position; allowlist: string[] }>>,
  noticed: {
    hash: 0,
    list: [] as string[]
  },
  denylist: {} as Record<string, string>
};

export type Data = typeof DATA_DEFAULT;

export const DATA = new AutoJsonConfigFile(DATA_PATH, DATA_DEFAULT);
