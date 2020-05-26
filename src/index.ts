import { ensureEsbuildService } from 'vite'
import { transformReactCode } from 'vite-plugin-react/dist/transform'
import mdx from '@mdx-js/mdx'
import type { Plugin } from 'vite'

const DEFAULT_RENDERER = `
import React from 'react'
import { mdx } from '@mdx-js/react'
`

module.exports = {
  configureServer: [
    (ctx) => {
      // make sure vite-plugin-react is applied
      const vprConfigureServer = ensureArray(
        require('vite-plugin-react').configureServer
      )[0]
      const vprIsApplied =
        ensureArray(ctx.config.configureServer).indexOf(vprConfigureServer) >= 0
      if (!vprIsApplied)
        throw new Error(
          'Can not detect vite-plugin-react. vite-plugin-mdx must be used with vite-plugin-react.'
        )
    }
  ],
  transforms: [
    {
      test(path, query) {
        if (/\.mdx?$/.test(path)) {
          return true
        }
        return false
      },
      async transform(code, isImport, isBuild, path) {
        const jsx = await mdx(code)
        const esBuild = await ensureEsbuildService()
        const { js } = await esBuild.transform(jsx, {
          loader: 'jsx',
          target: 'es2019',
          jsxFactory: 'mdx'
        })
        // make mdx React component self-accepting
        const result = transformReactCode(`${DEFAULT_RENDERER}\n${js}`, path)
        return result
      }
    }
  ]
} as Plugin

function ensureArray(value: any) {
  return Array.isArray(value) ? value : [value]
}
