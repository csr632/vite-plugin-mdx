import type { UserConfig } from 'vite'
import mdx from 'vite-plugin-mdx'
import react from 'vite-plugin-react'

module.exports = {
  jsx: 'react',
  plugins: [react, mdx],
  rollupInputOptions: {
    // external: ['@pika/react', '@pika/react-dom']
  }
} as UserConfig
