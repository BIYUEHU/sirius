import { Data } from '../constants'

export function ObjToPos({ x, y, z, dimension }: Data['homes'][string][string]) {
  return new FloatPos(x, y, z, dimension)
}

export function PosToObj({ x, y, z, dimid: dimension }: FloatPos | IntPos) {
  return { x, y, z, dimension }
}

export function ObjPosToStr({ x, y, z, dimension }: Data['homes'][string][string]) {
  return `${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)}`
}
