import {
  getIconCollections,
  iconsPlugin,
} from '@egoist/tailwindcss-icons'
import scrollbarPlugin from 'tailwind-scrollbar'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['material-symbols']),
      scale: 1.5,
    }),
    scrollbarPlugin,
    plugin(({ addUtilities }) => {
      addUtilities({
        ['.drag-none']: {
          ['-khtml-user-drag']: 'none',
          ['-moz-user-drag']: 'none',
          ['-o-user-drag']: 'none',
          ['-webkit-user-drag']: 'none',
          ['user-drag']: 'none',
        },
      })
    }),
  ],
}
