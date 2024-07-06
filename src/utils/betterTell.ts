export const enum TargetEntity {
  ENTITY = '@e',
  ALL = '@a',
  SELF = '@s',
  PLAYER = '@p',
  RANDOM = '@r'
}

export function betterTell(message: string, target: TargetEntity | string | Player) {
  const targetSelector = typeof target === 'object' ? target.realName : target
  return mc.runcmd(`tellraw "${targetSelector}" {"rawtext":[{"text":"${message}"}]}`)
}
