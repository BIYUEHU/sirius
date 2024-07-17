/// <reference path="../node_modules/levilamina/types/index.d.ts"/>

interface Function {
  getName: () => string
}

declare module '*package.json' {
  const value: any
  export default value
}

declare var console: undefined
