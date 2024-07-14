import TOML from '../modules/tomlParser'
import { CONFIG, LOCALE_PATH, PLUGIN_NAME } from '../constants/constants'
import I18n from '../modules/i18n'
import { ObjPosToStr, PosToObj } from './position'

const { Version } = require('./GMLIB-LegacyRemoteCallApi/lib/GMLIB_API-JS')
const PAPI = require('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS.js').PAPI as {
  translateString(str: string, pl?: Player): string
  registerPlayerPlaceholder(callback: (pl: Player) => string, pluginName: string, PAPIName: string): boolean
}

if (!Version || !PAPI) {
  logger.error(t`info.miss_gmlib`)
} else {
  PAPI.registerPlayerPlaceholder((pl) => pl.realName, PLUGIN_NAME, 'name')
  PAPI.registerPlayerPlaceholder(
    (pl) => t(['info.dim_0', 'info.dim_1', 'info.dim_2'][pl.pos.dimid] ?? 'info.dim_3'),
    PLUGIN_NAME,
    'dim'
  )
  PAPI.registerPlayerPlaceholder((pl) => ObjPosToStr(PosToObj(pl.pos)), PLUGIN_NAME, 'pos')
  PAPI.registerPlayerPlaceholder((pl) => pl.langCode, PLUGIN_NAME, 'locale')
  PAPI.registerPlayerPlaceholder((pl) => pl.xuid, PLUGIN_NAME, 'xuid')
  PAPI.registerPlayerPlaceholder((pl) => pl.uuid, PLUGIN_NAME, 'uuid')
  PAPI.registerPlayerPlaceholder((pl) => String(pl.speed), PLUGIN_NAME, 'speed')
  PAPI.registerPlayerPlaceholder((pl) => String(pl.health), PLUGIN_NAME, 'health')
  PAPI.registerPlayerPlaceholder((pl) => String(pl.maxHealth), PLUGIN_NAME, 'max_health')
  PAPI.registerPlayerPlaceholder(
    (pl) => t(['info.mode_0', 'info.mode_1', 'info.mode_2', 'info.mode_3'][pl.gameMode]),
    PLUGIN_NAME,
    'game_mode'
  )
  PAPI.registerPlayerPlaceholder(
    (pl) => t(['info.perm_0', 'info.perm_1', 'info.perm_2'][pl.permLevel]),
    PLUGIN_NAME,
    'perm_level'
  )
  PAPI.registerPlayerPlaceholder((pl) => pl.getDevice().avgPing.toString(), PLUGIN_NAME, 'ping')
  PAPI.registerPlayerPlaceholder((pl) => pl.getDevice().avgPacketLoss.toString(), PLUGIN_NAME, 'loss')
  PAPI.registerPlayerPlaceholder((pl) => pl.getDevice().ip, PLUGIN_NAME, 'ip')
  PAPI.registerPlayerPlaceholder((_) => new Date().getFullYear().toString(), PLUGIN_NAME, 'y')
  PAPI.registerPlayerPlaceholder((_) => (new Date().getMonth() + 1).toString().padStart(2, '0'), PLUGIN_NAME, 'm')
  PAPI.registerPlayerPlaceholder((_) => new Date().getDate().toString().padStart(2, '0'), PLUGIN_NAME, 'd')
  PAPI.registerPlayerPlaceholder((_) => new Date().getHours().toString().padStart(2, '0'), PLUGIN_NAME, 'h')
  PAPI.registerPlayerPlaceholder((_) => new Date().getMinutes().toString().padStart(2, '0'), PLUGIN_NAME, 'min')
  PAPI.registerPlayerPlaceholder((_) => new Date().getSeconds().toString().padStart(2, '0'), PLUGIN_NAME, 's')
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
  return i18n.locale(typeof key === 'string' ? key : key.join(''))
}

export function tp(key: string, pl: Player, ...args: string[]) {
  return PAPI.translateString(t(key, ...args), pl)
}

export default t
