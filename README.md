# [WIP] vite-plugin-mdx

[Pending upstream prs](https://github.com/csr632/vite-plugin-mdx/issues/1)

Provides [MDX](https://mdxjs.com/) Fast Refresh support for Vite.

Note: This plugin should be used with `vite-plugin-react`.

```js
// vite.config.js
import mdx from 'vite-plugin-mdx'
import react from 'vite-plugin-react'

module.exports = {
  jsx: 'react',
  plugins: [react, mdx]
}
```

You can use any [mdx plugins](https://mdxjs.com/advanced/plugins) that you like:

```js
// vite.config.js
import { createPlugin } from 'vite-plugin-mdx'
import react from 'vite-plugin-react'
import remarkToc from 'remark-toc'
import remarkSlug from 'remark-slug'

module.exports = {
  jsx: 'react',
  plugins: [
    react,
    createPlugin({
      remarkPlugins: [remarkToc, remarkSlug]
    })
  ]
}
```
