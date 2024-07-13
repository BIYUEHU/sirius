import TOML from '../modules/tomlParser'
import { CONFIG, LOCALE_PATH } from '../constants/constants'
import I18n from '../modules/i18n'

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

export default t
