import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'
import sh from 'shelljs'
import { config } from 'dotenv'

config()

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const PLUGIN_NAME = /* `${pkg.name.charAt(0).toUpperCase()}${pkg.name.slice(1)}` */ 'Sirius'
const PLUGIN_DIR = resolve(__dirname, process.env.BDS_PATH ?? 'server', `plugins/${PLUGIN_NAME}/`)
const PLUGIN_STATIC_DIR = resolve(__dirname, 'static')
const MANIFEST = {
  entry: `${PLUGIN_NAME}.js`,
  name: PLUGIN_NAME,
  version: pkg.version,
  ...(pkg.description ? { description: pkg.description } : {}),
  ...(pkg.author ? { author: Array.isArray(pkg.author) ? pkg.author.join(', ') : pkg.author } : {}),
  ...(pkg.license ? { license: pkg.license } : {}),
  ...(pkg.levilamina ?? {})
}

export default defineConfig(({ define }) => {
  const isRelease = define?.release !== undefined
  const DIR = isRelease ? resolve('dist') : PLUGIN_DIR
  if (isRelease) {
    sh.rm('-rf', 'dist')
    sh.mkdir('-p', 'dist')
    sh.cp('-R', `${PLUGIN_STATIC_DIR}/*`, `${DIR}`)
  } else sh.cp('-R', `${PLUGIN_STATIC_DIR}/*`, `${DIR}*`)
  writeFileSync(resolve(DIR, 'manifest.json'), JSON.stringify(MANIFEST, null, 2))
  return {
    entryPoints: [`./src/${PLUGIN_NAME}.ts`],
    minify: !!isRelease,
    outDir: DIR,
    banner: {
      js: `
/**
 * @Package ${pkg.name ?? 'unknown'}
 * @Version ${pkg.version ?? 'unknown'}
 * @Author ${Array.isArray(pkg.author) ? pkg.author.join(', ') : pkg.author ?? ''}
 * @Copyright 2024 Arimura Sena. All rights reserved.
 * @License ${pkg.license ?? 'GPL-3.0'}
 * @Link ${pkg.homepage ?? ''}
 * @Date ${new Date().toLocaleString()}
 */
`
    }
  }
})
