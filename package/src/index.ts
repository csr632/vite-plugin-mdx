import type { Plugin } from 'vite'
import { transform } from './transform'

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
          const forHMR = !(
            isBuild ||
            path.startsWith(`/@modules/`) ||
            process.env.NODE_ENV === 'production'
          )
          return transform({ code, mdxOpts, forHMR, path })
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

export { transform }
