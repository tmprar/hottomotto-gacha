import type { items as menuItems } from '~/assets/items.json'

export type TMenuItem = (typeof menuItems)[number]

export { items as menuItems } from '~/assets/items.json'
