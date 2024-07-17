import TOML from '../modules/tomlParser'
import { CONFIG, LOCALE_PATH, PLUGIN_NAME } from '../constants/constants'
import I18n from '../modules/i18n'
import { ObjPosToStr, PosToObj } from './position'

const { lang } = CONFIG.get('global')
const i18n = new I18n({ lang })
const localePath = `${LOCALE_PATH}/${lang}.toml`
if (!File.exists(localePath)) throw new Error(`Locale file not found: ${localePath}`)

i18n.use(flattenObject(TOML.parse(File.readFrom(localePath) || '')), lang)

function t(key: string, ...args: string[]): string

function t(key: string | TemplateStringsArray): string

function t(key: string | TemplateStringsArray, ...args: string[]) {
  if (args && args.length > 0) {
    let str = t(key)
    let index = 0
    for (const arg of args) {
      str = str.replace(new RegExp(`\\{${index}\\}`, 'g'), t(arg))
      index += 1
    }
    return str
  }
  const input = typeof key === 'string' ? key : key.join('')
  return i18n.locale(input) ?? input
}

// biome-ignore lint:
let PAPI: any

export function tp(key: string, pl: Player, ...args: string[]) {
  return PAPI ? PAPI.translateString(t(key, ...args), pl) : t(key, ...args)
}

// biome-ignore lint:
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  // biome-ignore lint:
  const flattened: Record<string, any> = {}

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey))
      } else {
        flattened[newKey] = obj[key]
      }
    }
  }

  return flattened
}

export const PLUGIN_DESCRIPTION = t`plugin.description`

function handlePAPI() {
  t`comment: 傻逼 tsup，我特么都说了不是 node.js 还特么搁这处理 require()，于是只好重命名了`
  const r = require

  if (!r('./GMLIB-LegacyRemoteCallApi/lib/GMLIB_API-JS').Version) {
    logger.error(t`info.miss_gmlib`)
    return
  }

  PAPI = r('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS.js').PAPI
  if (!PAPI) {
    logger.error(t`info.miss_gmlib`)
    return
  }

  t`Comment: 傻逼 GMLIB 我操你妈，我特么调试半天寻思怎么就报错了，原来是你那傻逼玩意不支持箭头函数作为回调函数，老子这辈子写这么久 JS 见过最无语的傻屌`
  function getName(pl: Player) {
    return pl.realName
  }
  PAPI.registerPlayerPlaceholder(getName, PLUGIN_NAME, 'name')
  function getDim(pl: Player) {
    return t(['info.dim_0', 'info.dim_1', 'info.dim_2'][pl.pos.dimid] ?? 'info.dim_3')
  }
  PAPI.registerPlayerPlaceholder(getDim, PLUGIN_NAME, 'dim')
  function getPos(pl: Player) {
    return ObjPosToStr(PosToObj(pl.pos))
  }
  PAPI.registerPlayerPlaceholder(getPos, PLUGIN_NAME, 'pos')
  function getLocale(pl: Player) {
    return pl.langCode
  }
  PAPI.registerPlayerPlaceholder(getLocale, PLUGIN_NAME, 'locale')
  function getXuid(pl: Player) {
    return pl.xuid
  }
  PAPI.registerPlayerPlaceholder(getXuid, PLUGIN_NAME, 'xuid')
  function getUuid(pl: Player) {
    return pl.uuid
  }
  PAPI.registerPlayerPlaceholder(getUuid, PLUGIN_NAME, 'uuid')
  function getSpeed(pl: Player) {
    return pl.speed.toFixed(2)
  }
  PAPI.registerPlayerPlaceholder(getSpeed, PLUGIN_NAME, 'speed')
  function getHealth(pl: Player) {
    return String(pl.health)
  }
  PAPI.registerPlayerPlaceholder(getHealth, PLUGIN_NAME, 'health')
  function getMaxHealth(pl: Player) {
    return String(pl.maxHealth)
  }
  PAPI.registerPlayerPlaceholder(getMaxHealth, PLUGIN_NAME, 'max_health')
  function getGameMode(pl: Player) {
    return t(['info.mode_0', 'info.mode_1', 'info.mode_2', 'info.mode_3'][pl.gameMode])
  }
  PAPI.registerPlayerPlaceholder(getGameMode, PLUGIN_NAME, 'game_mode')
  function getPermLevel(pl: Player) {
    return t(['info.perm_0', 'info.perm_1', 'info.perm_2'][pl.permLevel])
  }
  PAPI.registerPlayerPlaceholder(getPermLevel, PLUGIN_NAME, 'perm_level')
  function getPing(pl: Player) {
    return pl.getDevice().avgPing.toString()
  }
  PAPI.registerPlayerPlaceholder(getPing, PLUGIN_NAME, 'ping')
  function getLoss(pl: Player) {
    return pl.getDevice().avgPacketLoss.toFixed(2)
  }
  PAPI.registerPlayerPlaceholder(getLoss, PLUGIN_NAME, 'loss')
  function getIp(pl: Player) {
    return pl.getDevice().ip
  }
  PAPI.registerPlayerPlaceholder(getIp, PLUGIN_NAME, 'ip')
  function getY() {
    return new Date().getFullYear().toString()
  }
  PAPI.registerPlayerPlaceholder(getY, PLUGIN_NAME, 'y')
  function getM() {
    return (new Date().getMonth() + 1).toString().padStart(2, '0')
  }
  PAPI.registerPlayerPlaceholder(getM, PLUGIN_NAME, 'm')
  function getD() {
    return new Date().getDate().toString().padStart(2, '0')
  }
  PAPI.registerPlayerPlaceholder(getD, PLUGIN_NAME, 'd')
  function getH() {
    return new Date().getHours().toString().padStart(2, '0')
  }
  PAPI.registerPlayerPlaceholder(getH, PLUGIN_NAME, 'h')
  function getMin() {
    return new Date().getMinutes().toString().padStart(2, '0')
  }
  PAPI.registerPlayerPlaceholder(getMin, PLUGIN_NAME, 'min')
  function getS() {
    return new Date().getSeconds().toString().padStart(2, '0')
  }
  PAPI.registerPlayerPlaceholder(getS, PLUGIN_NAME, 's')
}

mc.listen('onServerStarted', () => {
  try {
    handlePAPI()
  } catch (e) {
    logger.warn(`Error while register PAPI: ${e}`, e)
    logger.warn(t`info.miss_gmlib`)
    logger.warn(t`info.miss_gmlib_2`)
  }
})

export default t
