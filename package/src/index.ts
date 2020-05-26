import { ensureEsbuildService } from 'vite'
import { transformReactCode } from 'vite-plugin-react/dist/transform'
import mdx from '@mdx-js/mdx'
import type { Plugin } from 'vite'

const DEFAULT_RENDERER = `
import React from 'react'
import { mdx } from '@mdx-js/react'
`

export function createPlugin(mdxOpts?: any) {
  return {
    configureServer: [
      (ctx) => {
        // make sure vite-plugin-react is applied
        const vprConfigureServer = ensureArray(
          require('vite-plugin-react').configureServer
        )[0]
        const vprIsApplied =
          ensureArray(ctx.config.configureServer).indexOf(vprConfigureServer) >=
          0
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
          const jsx = await mdx(code, mdxOpts)
          const esBuild = await ensureEsbuildService()
          const { js } = await esBuild.transform(jsx, {
            loader: 'jsx',
            target: 'es2019',
            jsxFactory: 'mdx'
          })
          const withoutHMR = `${DEFAULT_RENDERER}\n${js}`

          if (
            isBuild ||
            path.startsWith(`/@modules/`) ||
            process.env.NODE_ENV === 'production'
          ) {
            // do not transform for production builds
            return withoutHMR
          }
          // make mdx React component self-accepting
          const withHMR = transformReactCode(withoutHMR, path)
          return withHMR
        }
      }
    ]
  } as Plugin
}

const defaultPlugin = createPlugin()
export default defaultPlugin

function ensureArray(value: any) {
  return Array.isArray(value) ? value : [value]
}
