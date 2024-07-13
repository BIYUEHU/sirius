import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const { Owner } = require(resolve(__dirname, 'relationship.json'))
const { Lands } = require(resolve(__dirname, 'data.json'))

function getXuid(uuid: string) {
  for (const [xuid, list] of Object.entries(Owner)) {
    if (!Array.isArray(list)) continue
    if (list.includes(uuid)) return xuid
  }
  return null
}

function counter() {
  let totalCount = 0
  let missCount = 0

  function count(msg?: string) {
    totalCount += 1
    if (msg) console.log(msg, `Count: ${totalCount}`)
  }

  function miss(msg?: string) {
    count()
    missCount += 1
    if (msg) console.error(msg, `Miss: ${totalCount}`)
  }

  function result() {
    console.log(`Total: ${totalCount}, Miss: ${missCount}`)
  }

  return { count, miss, result }
}

const { count, miss, result } = counter()

const output = {
  lands: {} as Record<
    string,
    Record<string, { start: object; end: object; allowlist: string[]; leaveMsg: string; welcomeMsg: string }>
  >
}

for (const [uuid, land] of Object.entries(Lands)) {
  if (!land || typeof land !== 'object' || !('settings' in land)) {
    miss(`Invalid land data: ${land}`)
    continue
  }

  // biome-ignore lint:
  const { settings, range } = land as Record<string, any>
  if (!settings || typeof settings !== 'object') {
    miss(`Invalid settings data: ${settings}`)
    continue
  }
  if (!range || typeof range !== 'object') {
    miss(`Invalid range data: ${range}`)
    continue
  }

  const xuid = getXuid(uuid)
  if (!xuid) {
    miss(`Cannot find xuid for ${uuid}`)
    continue
  }

  output.lands[xuid] = {
    ...(output.lands[xuid] || {}),
    [settings.nickname]: {
      allowlist: settings.share,
      leaveMsg: '',
      welcomeMsg: settings.describe.replaceAll('$visitor', '%name%'),
      start: {
        x: range.start_position[0],
        y: range.start_position[1],
        z: range.start_position[2],
        dimension: range.dimid
      },
      end: {
        x: range.end_position[0],
        y: range.end_position[1],
        z: range.end_position[2],
        dimension: range.dimid
      }
    }
  }

  count(`Processed ${uuid}`)
}

console.log(output)

result()

writeFileSync(resolve(__dirname, 'output.json'), JSON.stringify(output, null, 2))
console.log('Output saved to output.json')
