import pkg from '../package.json'
import AutoJsonConfigFile from './utils/autoJsonConfigFile'

export const PLUGIN_NAME = 'Sirius'

export const PLUGIN_DESCRIPTION = '下一代最全面的服务器基础&综合性功能插件'

export const PLUGIN_VERSION = pkg.version.split('.').map(Number)

export const PLUGIN_PATH = `./plugins/${PLUGIN_NAME}`

export const DATA_PATH = `${PLUGIN_PATH}/data`

export const GUI_PATH = `${PLUGIN_PATH}/gui`

export const CONFIG_FILE = `${PLUGIN_PATH}/config.json`

export const DATA_FILE = `${DATA_PATH}/data.json`

export const NOTICE_FILE = `${DATA_PATH}/notice.txt`

const CONFIG_DEFAULT = {
  global: {
    decode: true,
    lang: 'zh_CN' as 'en_US' | 'ja_JP' | 'zh_CN' | 'zh_TW'
  },
  utils: {
    enabled: true,
    itemsUseOn: {
      'minecraft:clock': 'menu'
    } as Record<string, string>,
    joinWelcomeEnabled: true,
    joinWelcomeMsg: 'Welcome to the server, %player%!',
    motdDynastyEnabled: true,
    motdMsgs: ['server motd!'],
    motdInterval: 5,
    chatFormatEnabled: true,
    chatFormat: '%player%: %message%',
    sidebarEnabled: true,
    safeCmdEnabled: true
  },
  helper: {
    enabled: true,
    noticeCmdEnabled: true,
    suicideCmdEnabled: true,
    backCmdEnabled: true,
    clockCmdEnabled: true,
    msguiCmdEnabled: true,
    hereCmdEnabled: true,
    mapCmdEnabled: true
  },
  teleport: {
    enabled: true,
    tpaCmdEnabled: true,
    tpaExpireTime: 20,
    tprCmdEnabled: true,
    tprMaxDistance: 10000,
    tprMinDistance: 1000,
    tprSafeHeight: 120,
    homeCmdEnabled: true,
    homeMaxCount: 15,
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
    mangerCmdEnabled: true,
    vanishCmdEnabled: true,
    runasCmdEnabled: true,
    banCmdEnabled: true,
    cloudBlackCheckEnabled: true,
    skickCmdEnabled: true,
    crashCmdEnabled: true,
    stopCmdEnabled: true,
    infoCmdEnabled: true
  },
  land: {
    /* Base on money component */
    enabled: true,
    maxBlockCount: 900000,
    buyPrice: 0.5,
    destPrice: 0.4
  },
  money: {
    enabled: true,
    // default: 0,
    scoreboardName: 'money',
    syncLLMoney: true,
    // payRate: 80,
    shopCmdEnabled: true,
    hunterEnabled: true
  },
  hunter: [
    { entityId: 'minecraft:villager', price: 100 },
    { entityId: 'minecraft:zombie', price: [100, 200] }
  ] as Array<{ entityId: string; price: number | [number, number] }>,
  shop: {
    默认分类: [
      { icon: 'texture/items/diamond', itemId: 'minecraft:diamond', text: '钻石', price: 100, type: 'buy' },
      { icon: 'texture/items/gold_ingot', itemId: 'minecraft:gold_ingot', text: '黄金', price: 500, type: 'sell' }
    ]
  } as Record<
    string,
    Array<{ icon?: string; text: string; count?: number; itemId: string; price: number; type: 'buy' | 'sell' }>
  >
}

export type Config = typeof CONFIG_DEFAULT

export const CONFIG = new AutoJsonConfigFile(CONFIG_FILE, CONFIG_DEFAULT)

interface Position {
  dimension: 0 | 1 | 2
  x: number
  y: number
  z: number
}

const DATA_DEFAULT = {
  xuids: {} as Record<string, String>,
  tpasEnableList: [] as string[],
  homes: {} as Record<string, Record<string, Position>>,
  warps: {} as Record<string, Position>,
  lands: {} as Record<
    string,
    Record<string, { start: Position; end: Position; allowlist: string[]; leaveMsg: string; welcomeMsg: string }>
  >,
  noticed: {
    hash: 0,
    list: [] as string[]
  },
  denylist: {} as Record<string, string>,
  bans: {} as Record<string, { reason: string; time: number }>,
  safety: false
}

export type Data = typeof DATA_DEFAULT

export const DATA = new AutoJsonConfigFile(DATA_FILE, DATA_DEFAULT)

export const enum UPDATE {
  REPO = 'https://github.com/biyuehu/sirius',
  META = 'https://hotaru.icu/api/agent/?url=https://raw.githubusercontent.com/biyuehu/sirius/master/package.json'
}
