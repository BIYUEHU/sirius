declare class TomlDate extends Date {
  constructor(dateString: string)
  isDateTime(): boolean
  isLocal(): boolean
  isDate(): boolean
  isTime(): boolean
  isValid(): boolean
  toISOString(): string
  static wrapAsOffsetDateTime(date: Date, offset?: string): TomlDate
  static wrapAsLocalDateTime(date: Date): TomlDate
  static wrapAsLocalDate(date: Date): TomlDate
  static wrapAsLocalTime(date: Date): TomlDate
}

declare class TomlError extends Error {
  line: number
  column: number
  codeblock: string
  constructor(message: string, context: { toml: string; ptr: number })
}

declare function parse(toml: string): { [key: string]: any }

declare function stringify(obj: { [key: string]: any }): string

declare const _default: {
  parse: typeof parse
  stringify: typeof stringify
}

export { TomlDate, TomlError, parse, stringify }

export default _default
