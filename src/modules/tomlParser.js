class e extends Error {
  line
  column
  codeblock
  constructor(e, t) {
    const [n, r] = (function (e, t) {
        let n = e.slice(0, t).split(/\r\n|\n|\r/g)
        return [n.length, n.pop().length + 1]
      })(t.toml, t.ptr),
      i = (function (e, t, n) {
        let r = e.split(/\r\n|\n|\r/g),
          i = '',
          l = 1 + (0 | Math.log10(t + 1))
        for (let e = t - 1; e <= t + 1; e++) {
          let o = r[e - 1]
          o &&
            ((i += e.toString().padEnd(l, ' ')),
            (i += ':  '),
            (i += o),
            (i += '\n'),
            e === t && ((i += ' '.repeat(l + n + 2)), (i += '^\n')))
        }
        return i
      })(t.toml, n, r)
    super(`Invalid TOML document: ${e}\n\n${i}`, t), (this.line = n), (this.column = r), (this.codeblock = i)
  }
}

let t = /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}:\d{2}(?:\.\d+)?)?(Z|[-+]\d{2}:\d{2})?$/i

class n extends Date {
  #e = !1
  #t = !1
  #n = null
  constructor(e) {
    let n = !0,
      r = !0,
      i = 'Z'
    if ('string' == typeof e) {
      let l = e.match(t)
      l
        ? (l[1] || ((n = !1), (e = `0000-01-01T${e}`)),
          (r = !!l[2]),
          l[2] && +l[2] > 23 ? (e = '') : ((i = l[3] || null), (e = e.toUpperCase()), i || (e += 'Z')))
        : (e = '')
    }
    super(e), isNaN(this.getTime()) || ((this.#e = n), (this.#t = r), (this.#n = i))
  }
  isDateTime() {
    return this.#e && this.#t
  }
  isLocal() {
    return !this.#e || !this.#t || !this.#n
  }
  isDate() {
    return this.#e && !this.#t
  }
  isTime() {
    return this.#t && !this.#e
  }
  isValid() {
    return this.#e || this.#t
  }
  toISOString() {
    let e = super.toISOString()
    if (this.isDate()) return e.slice(0, 10)
    if (this.isTime()) return e.slice(11, 23)
    if (null === this.#n) return e.slice(0, -1)
    if ('Z' === this.#n) return e
    let t = 60 * +this.#n.slice(1, 3) + +this.#n.slice(4, 6)
    return (t = '-' === this.#n[0] ? t : -t), new Date(this.getTime() - 6e4 * t).toISOString().slice(0, -1) + this.#n
  }
  static wrapAsOffsetDateTime(e, t = 'Z') {
    let r = new n(e)
    return (r.#n = t), r
  }
  static wrapAsLocalDateTime(e) {
    let t = new n(e)
    return (t.#n = null), t
  }
  static wrapAsLocalDate(e) {
    let t = new n(e)
    return (t.#t = !1), (t.#n = null), t
  }
  static wrapAsLocalTime(e) {
    let t = new n(e)
    return (t.#e = !1), (t.#n = null), t
  }
}

function r(e, t = 0, n = e.length) {
  let r = e.indexOf('\n', t)
  return '\r' === e[r - 1] && r--, r <= n ? r : -1
}
function i(t, n) {
  for (let r = n; r < t.length; r++) {
    let i = t[r]
    if ('\n' === i) return r
    if ('\r' === i && '\n' === t[r + 1]) return r + 1
    if ((i < ' ' && '\t' !== i) || '' === i)
      throw new e('control characters are not allowed in comments', {
        toml: t,
        ptr: n
      })
  }
  return t.length
}
function l(e, t, n, r) {
  let o
  for (; ' ' === (o = e[t]) || '\t' === o || (!n && ('\n' === o || ('\r' === o && '\n' === e[t + 1]))); ) t++
  return r || '#' !== o ? t : l(e, i(e, t), n)
}
function o(t, n, i, l, o = !1) {
  if (!l) return (n = r(t, n)) < 0 ? t.length : n
  for (let e = n; e < t.length; e++) {
    let n = t[e]
    if ('#' === n) e = r(t, e)
    else {
      if (n === i) return e + 1
      if (n === l) return e
      if (o && ('\n' === n || ('\r' === n && '\n' === t[e + 1]))) return e
    }
  }
  throw new e('cannot find end of structure', { toml: t, ptr: n })
}
function f(e, t) {
  let n = e[t],
    r = n === e[t + 1] && e[t + 1] === e[t + 2] ? e.slice(t, t + 3) : n
  t += r.length - 1
  do {
    t = e.indexOf(r, ++t)
  } while (t > -1 && "'" !== n && '\\' === e[t - 1] && '\\' !== e[t - 2])
  return t > -1 && ((t += r.length), r.length > 1 && (e[t] === n && t++, e[t] === n && t++)), t
}

let a = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/,
  s = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/,
  u = /^[+-]?0[0-9_]/,
  c = /^[0-9a-f]{4,8}$/i,
  d = { b: '\b', t: '\t', n: '\n', f: '\f', r: '\r', '"': '"', '\\': '\\' }
function h(t, n = 0, r = t.length) {
  let i = "'" === t[n],
    o = t[n++] === t[n] && t[n] === t[n + 1]
  o && ((r -= 2), '\r' === t[(n += 2)] && n++, '\n' === t[n] && n++)
  let f,
    a = 0,
    s = '',
    u = n
  for (; n < r - 1; ) {
    let r = t[n++]
    if ('\n' === r || ('\r' === r && '\n' === t[n])) {
      if (!o)
        throw new e('newlines are not allowed in strings', {
          toml: t,
          ptr: n - 1
        })
    } else if ((r < ' ' && '\t' !== r) || '' === r)
      throw new e('control characters are not allowed in strings', {
        toml: t,
        ptr: n - 1
      })
    if (f) {
      if (((f = !1), 'u' === r || 'U' === r)) {
        let i = t.slice(n, (n += 'u' === r ? 4 : 8))
        if (!c.test(i)) throw new e('invalid unicode escape', { toml: t, ptr: a })
        try {
          s += String.fromCodePoint(parseInt(i, 16))
        } catch {
          throw new e('invalid unicode escape', { toml: t, ptr: a })
        }
      } else if (!o || ('\n' !== r && ' ' !== r && '\t' !== r && '\r' !== r)) {
        if (!(r in d)) throw new e('unrecognized escape sequence', { toml: t, ptr: a })
        s += d[r]
      } else {
        if ('\n' !== t[(n = l(t, n - 1, !0))] && '\r' !== t[n])
          throw new e('invalid escape: only line-ending whitespace may be escaped', { toml: t, ptr: a })
        n = l(t, n)
      }
      u = n
    } else i || '\\' !== r || ((a = n - 1), (f = !0), (s += t.slice(u, a)))
  }
  return s + t.slice(u, r - 1)
}
function w(t, r, i) {
  if ('true' === t) return !0
  if ('false' === t) return !1
  if ('-inf' === t) return -1 / 0
  if ('inf' === t || '+inf' === t) return 1 / 0
  if ('nan' === t || '+nan' === t || '-nan' === t) return NaN
  if ('-0' === t) return 0
  let l
  if ((l = a.test(t)) || s.test(t)) {
    if (u.test(t)) throw new e('leading zeroes are not allowed', { toml: r, ptr: i })
    let n = +t.replace(/_/g, '')
    if (isNaN(n)) throw new e('invalid number', { toml: r, ptr: i })
    if (l && !Number.isSafeInteger(n))
      throw new e('integer value cannot be represented losslessly', {
        toml: r,
        ptr: i
      })
    return n
  }
  let o = new n(t)
  if (!o.isValid()) throw new e('invalid value', { toml: r, ptr: i })
  return o
}

function p(t, n, a) {
  let s,
    u = t[n]
  if ('[' === u || '{' === u) {
    let [l, f] =
        '[' === u
          ? (function (t, n) {
              let r,
                l = []
              n++
              for (; ']' !== (r = t[n++]) && r; ) {
                if (',' === r)
                  throw new e('expected value, found comma', {
                    toml: t,
                    ptr: n - 1
                  })
                if ('#' === r) n = i(t, n)
                else if (' ' !== r && '\t' !== r && '\n' !== r && '\r' !== r) {
                  let e = p(t, n - 1, ']')
                  l.push(e[0]), (n = e[1])
                }
              }
              if (!r)
                throw new e('unfinished array encountered', {
                  toml: t,
                  ptr: n
                })
              return [l, n]
            })(t, n)
          : (function (t, n) {
              let r,
                i = {},
                l = new Set(),
                o = 0
              n++
              for (; '}' !== (r = t[n++]) && r; ) {
                if ('\n' === r)
                  throw new e('newlines are not allowed in inline tables', {
                    toml: t,
                    ptr: n - 1
                  })
                if ('#' === r)
                  throw new e('inline tables cannot contain comments', {
                    toml: t,
                    ptr: n - 1
                  })
                if (',' === r)
                  throw new e('expected key-value, found comma', {
                    toml: t,
                    ptr: n - 1
                  })
                if (' ' !== r && '\t' !== r) {
                  let r,
                    f = i,
                    a = !1,
                    [s, u] = g(t, n - 1)
                  for (let i = 0; i < s.length; i++) {
                    if (
                      (i && (f = a ? f[r] : (f[r] = {})),
                      (r = s[i]),
                      (a = Object.hasOwn(f, r)) && ('object' != typeof f[r] || l.has(f[r])))
                    )
                      throw new e('trying to redefine an already defined value', { toml: t, ptr: n })
                    a ||
                      '__proto__' !== r ||
                      Object.defineProperty(f, r, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                      })
                  }
                  if (a)
                    throw new e('trying to redefine an already defined value', {
                      toml: t,
                      ptr: n
                    })
                  let [c, d] = p(t, u, '}')
                  l.add(c), (f[r] = c), (o = ',' === t[(n = d) - 1] ? n - 1 : 0)
                }
              }
              if (o) throw new e('trailing commas are not allowed in inline tables', { toml: t, ptr: o })
              if (!r)
                throw new e('unfinished table encountered', {
                  toml: t,
                  ptr: n
                })
              return [i, n]
            })(t, n),
      s = o(t, f, ',', a)
    if ('}' === a) {
      let n = r(t, f, s)
      if (n > -1)
        throw new e('newlines are not allowed in inline tables', {
          toml: t,
          ptr: n
        })
    }
    return [l, s]
  }
  if ('"' === u || "'" === u) {
    s = f(t, n)
    let r = h(t, n, s)
    if (a) {
      if (((s = l(t, s, ']' !== a)), t[s] && ',' !== t[s] && t[s] !== a && '\n' !== t[s] && '\r' !== t[s]))
        throw new e('unexpected character encountered', { toml: t, ptr: s })
      s += +(',' === t[s])
    }
    return [r, s]
  }
  s = o(t, n, ',', a)
  let c = (function (t, n, r, l) {
    let o = t.slice(n, r),
      f = o.indexOf('#')
    f > -1 && (i(t, f), (o = o.slice(0, f)))
    let a = o.trimEnd()
    if (!l) {
      let r = o.indexOf('\n', a.length)
      if (r > -1)
        throw new e('newlines are not allowed in inline tables', {
          toml: t,
          ptr: n + r
        })
    }
    return [a, f]
  })(t, n, s - +(',' === t[s - 1]), ']' === a)
  if (!c[0])
    throw new e('incomplete key-value declaration: no value specified', {
      toml: t,
      ptr: n
    })
  return a && c[1] > -1 && ((s = l(t, n + c[1])), (s += +(',' === t[s]))), [w(c[0], t, n), s]
}
let m = /^[a-zA-Z0-9-_]+[ \t]*$/
function g(t, n, i = '=') {
  let o = n - 1,
    a = [],
    s = t.indexOf(i, n)
  if (s < 0)
    throw new e('incomplete key-value: cannot find end of key', {
      toml: t,
      ptr: n
    })
  do {
    let l = t[(n = ++o)]
    if (' ' !== l && '\t' !== l)
      if ('"' === l || "'" === l) {
        if (l === t[n + 1] && l === t[n + 2])
          throw new e('multiline strings are not allowed in keys', {
            toml: t,
            ptr: n
          })
        let u = f(t, n)
        if (u < 0) throw new e('unfinished string encountered', { toml: t, ptr: n })
        o = t.indexOf('.', u)
        let c = t.slice(u, o < 0 || o > s ? s : o),
          d = r(c)
        if (d > -1)
          throw new e('newlines are not allowed in keys', {
            toml: t,
            ptr: n + o + d
          })
        if (c.trimStart())
          throw new e('found extra tokens after the string part', {
            toml: t,
            ptr: u
          })
        if (s < u && ((s = t.indexOf(i, u)), s < 0))
          throw new e('incomplete key-value: cannot find end of key', {
            toml: t,
            ptr: n
          })
        a.push(h(t, n, u))
      } else {
        o = t.indexOf('.', n)
        let r = t.slice(n, o < 0 || o > s ? s : o)
        if (!m.test(r))
          throw new e('only letter, numbers, dashes and underscores are allowed in keys', { toml: t, ptr: n })
        a.push(r.trimEnd())
      }
  } while (o + 1 && o < s)
  return [a, l(t, s + 1, !0, !0)]
}
function b(e, t, n, r) {
  let i,
    l,
    o = t,
    f = n,
    a = !1
  for (let t = 0; t < e.length; t++) {
    if (t) {
      if (((o = a ? o[i] : (o[i] = {})), (f = (l = f[i]).c), 0 === r && (1 === l.t || 2 === l.t))) return null
      if (2 === l.t) {
        let e = o.length - 1
        ;(o = o[e]), (f = f[e].c)
      }
    }
    if (((i = e[t]), (a = Object.hasOwn(o, i)) && 0 === f[i]?.t && f[i]?.d)) return null
    a ||
      ('__proto__' === i &&
        (Object.defineProperty(o, i, {
          enumerable: !0,
          configurable: !0,
          writable: !0
        }),
        Object.defineProperty(f, i, {
          enumerable: !0,
          configurable: !0,
          writable: !0
        })),
      (f[i] = { t: t < e.length - 1 && 2 === r ? 3 : r, d: !1, i: 0, c: {} }))
  }
  if (((l = f[i]), l.t !== r && (1 !== r || 3 !== l.t))) return null
  if (
    (2 === r &&
      (l.d || ((l.d = !0), (o[i] = [])), o[i].push((o = {})), (l.c[l.i++] = l = { t: 1, d: !1, i: 0, c: {} })),
    l.d)
  )
    return null
  if (((l.d = !0), 1 === r)) o = a ? o[i] : (o[i] = {})
  else if (0 === r && a) return null
  return [i, o, l.c]
}
function y(t) {
  let n = {},
    r = {},
    i = n,
    o = r
  for (let f = l(t, 0); f < t.length; ) {
    if ('[' === t[f]) {
      let l = '[' === t[++f],
        a = g(t, (f += +l), ']')
      if (l) {
        if (']' !== t[a[1] - 1])
          throw new e('expected end of table declaration', {
            toml: t,
            ptr: a[1] - 1
          })
        a[1]++
      }
      let s = b(a[0], n, r, l ? 2 : 1)
      if (!s)
        throw new e('trying to redefine an already defined table or value', {
          toml: t,
          ptr: f
        })
      ;(o = s[2]), (i = s[1]), (f = a[1])
    } else {
      let n = g(t, f),
        r = b(n[0], i, o, 0)
      if (!r)
        throw new e('trying to redefine an already defined table or value', {
          toml: t,
          ptr: f
        })
      let l = p(t, n[1])
      ;(r[1][r[0]] = l[0]), (f = l[1])
    }
    if (((f = l(t, f, !0)), t[f] && '\n' !== t[f] && '\r' !== t[f]))
      throw new e('each key-value declaration must be followed by an end-of-line', { toml: t, ptr: f })
    f = l(t, f)
  }
  return n
}
const v = /^[a-z0-9-_]+$/i
function O(e) {
  let t = typeof e
  if ('object' === t) {
    if (Array.isArray(e)) return 'array'
    if (e instanceof Date) return 'date'
  }
  return t
}
function T(e) {
  for (let t = 0; t < e.length; t++) if ('object' !== O(e[t])) return !1
  return !0
}
function x(e) {
  return JSON.stringify(e).replace(/\x7f/g, '\\u007f')
}
function $(e, t = O(e)) {
  if ('number' === t) return isNaN(e) ? 'nan' : e === 1 / 0 ? 'inf' : e === -1 / 0 ? '-inf' : e.toString()
  if ('bigint' === t || 'boolean' === t) return e.toString()
  if ('string' === t) return x(e)
  if ('date' === t) {
    if (isNaN(e.getTime())) throw new TypeError('cannot serialize invalid date')
    return e.toISOString()
  }
  return 'object' === t
    ? (function (e) {
        let t = '{ ',
          n = Object.keys(e)
        for (let r = 0; r < n.length; r++) {
          let i = n[r]
          r && (t += ', '), (t += v.test(i) ? i : x(i)), (t += ' = '), (t += $(e[i]))
        }
        return t + ' }'
      })(e)
    : 'array' === t
      ? (function (e) {
          let t = '[ '
          for (let n = 0; n < e.length; n++) {
            if ((n && (t += ', '), null === e[n] || void 0 === e[n]))
              throw new TypeError('arrays cannot contain null or undefined values')
            t += $(e[n])
          }
          return t + ' ]'
        })(e)
      : void 0
}
function D(e, t) {
  let n = ''
  for (let r = 0; r < e.length; r++) (n += `[[${t}]]\n`), (n += _(e[r], t)), (n += '\n\n')
  return n
}
function _(e, t = '') {
  let n = '',
    r = '',
    i = Object.keys(e)
  for (let l = 0; l < i.length; l++) {
    let o = i[l]
    if (null !== e[o] && void 0 !== e[o]) {
      let i = O(e[o])
      if ('symbol' === i || 'function' === i) throw new TypeError(`cannot serialize values of type '${i}'`)
      let l = v.test(o) ? o : x(o)
      if ('array' === i && T(e[o])) r += D(e[o], t ? `${t}.${l}` : l)
      else if ('object' === i) {
        let n = t ? `${t}.${l}` : l
        ;(r += `[${n}]\n`), (r += _(e[o], n)), (r += '\n\n')
      } else (n += l), (n += ' = '), (n += $(e[o], i)), (n += '\n')
    }
  }
  return `${n}\n${r}`.trim()
}
function S(e) {
  if ('object' !== O(e)) throw new TypeError('stringify can only be called with an object')
  return _(e)
}
export { n as TomlDate, e as TomlError, y as parse, S as stringify }

export default {
  parse: y,
  stringify: S
}
