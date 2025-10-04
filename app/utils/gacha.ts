import type { TMenuItem } from '~/utils/menu-item'

export enum Allergen {
  CRAB = 'ALLERGEN_TYPE_CRAB',
  EGG = 'ALLERGEN_TYPE_EGG',
  MILK = 'ALLERGEN_TYPE_MILK',
  SHRIMP = 'ALLERGEN_TYPE_SHRIMP',
  WHEAT = 'ALLERGEN_TYPE_WHEAT',
}

export const ALLERGEN_METADATA = {
  [Allergen.CRAB]: {
    label: 'カニ',
    value: Allergen.CRAB,
  },
  [Allergen.EGG]: {
    label: '卵',
    value: Allergen.EGG,
  },
  [Allergen.MILK]: {
    label: '乳',
    value: Allergen.MILK,
  },
  [Allergen.SHRIMP]: {
    label: 'エビ',
    value: Allergen.SHRIMP,
  },
  [Allergen.WHEAT]: {
    label: '小麦',
    value: Allergen.WHEAT,
  },
}

export interface IGachaOptions {
  allowDuplicates?: boolean
  requireStapleFood?: boolean
}

export interface IGachaResult {
  allowDuplicates: boolean
  items: TMenuItem[]
  maxBudget: number
  minBudget: number
  totalAmount: number
}

export function pullGacha(
  menuItems: TMenuItem[],
  minBudget: number = 800,
  maxBudget: number = 800,
  options: IGachaOptions = {},
): IGachaResult {
  const {
    allowDuplicates = true,
    requireStapleFood = false,
  } = options

  const selectedItems: TMenuItem[] = []
  let totalAmount = 0
  let remainingBudget = maxBudget
  const usedItemIds = new Set<string>()

  // 主食が必要な場合、まず主食を選択
  if (requireStapleFood) {
    const stapleFoods = menuItems.filter(item => item.hasStapleFood && item.price <= remainingBudget)

    if (stapleFoods.length === 0) {
      // 予算内で主食が選択できない場合
      return {
        allowDuplicates,
        items: [],
        maxBudget,
        minBudget,
        totalAmount: 0,
      }
    }

    const selectedStapleFood = stapleFoods[Math.floor(Math.random() * stapleFoods.length)]!

    selectedItems.push(selectedStapleFood)
    totalAmount += selectedStapleFood.price
    remainingBudget -= selectedStapleFood.price

    if (!allowDuplicates) {
      usedItemIds.add(selectedStapleFood.itemId)
    }
  }

  // 残り予算内で追加のアイテムを選択
  while (remainingBudget > 0) {
    const availableItems = menuItems.filter((item) => {
      if (item.price > remainingBudget) return false
      if (!allowDuplicates && usedItemIds.has(item.itemId)) return false

      return true
    })

    if (availableItems.length === 0) break

    const selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)]!

    selectedItems.push(selectedItem)
    totalAmount += selectedItem.price
    remainingBudget -= selectedItem.price

    if (!allowDuplicates) {
      usedItemIds.add(selectedItem.itemId)
    }
  }

  // 最小予算を満たしているかチェック
  if (totalAmount < minBudget) {
    // 最小予算を満たさない場合は再帰的に再実行
    return pullGacha(menuItems, minBudget, maxBudget, options)
  }

  return {
    allowDuplicates,
    items: selectedItems,
    maxBudget,
    minBudget,
    totalAmount,
  }
}
