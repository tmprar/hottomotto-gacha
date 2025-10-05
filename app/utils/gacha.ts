export enum Allergen {
  CRAB = 'ALLERGEN_TYPE_CRAB',
  EGG = 'ALLERGEN_TYPE_EGG',
  MILK = 'ALLERGEN_TYPE_MILK',
  SHRIMP = 'ALLERGEN_TYPE_SHRIMP',
  WHEAT = 'ALLERGEN_TYPE_WHEAT',
}

export type TMenuItem = {
  allergens: string[]
  customizeItems: {
    itemId: string
    name: string
    price: number
  }[]
  description: string
  hasStapleFood: boolean
  isAlcohol: boolean
  itemId: string
  name: string
  price: number
} | {
  allergens: string[]
  customizeItems?: undefined
  description: string
  hasStapleFood: boolean
  isAlcohol: boolean
  itemId: string
  name: string
  price: number
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
  items: TMenuItem[]
  maxBudget: number
  minBudget: number
  options: IGachaOptions
  success: boolean
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

  if (requireStapleFood) {
    const result = pullStapleFoodGacha(menuItems, minBudget, maxBudget, options)

    return {
      ...result,
      options,
    }
  }

  // ランダムサンプリング方式で効率的に組み合わせを生成
  const validCombination = generateRandomCombination(
    menuItems,
    minBudget,
    maxBudget,
    allowDuplicates,
  )

  if (!validCombination) {
    return {
      items: [],
      maxBudget,
      minBudget,
      options,
      success: false,
      totalAmount: 0,
    }
  }

  const totalAmount = validCombination.reduce((sum, item) => sum + item.price, 0)

  return {
    items: validCombination,
    maxBudget,
    minBudget,
    options,
    success: true,
    totalAmount,
  }
}

function generateRandomCombination(
  menuItems: TMenuItem[],
  minBudget: number,
  maxBudget: number,
  allowDuplicates: boolean,
  maxAttempts: number = 1000,
): null | TMenuItem[] {
  // 価格でソートして効率的な探索を可能にする
  const sortedItems = [...menuItems].toSorted((a, b) => a.price - b.price)
  let confirmedCombination: null | TMenuItem[] = null

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const combination: TMenuItem[] = []
    const usedItemIds = new Set<string>()
    let currentTotal = 0

    // ランダムに開始アイテムを選択
    const availableItems = sortedItems.filter(item => item.price <= maxBudget)

    if (availableItems.length === 0) return confirmedCombination

    while (currentTotal < maxBudget) {
      // 残り予算内で選択可能なアイテムを絞り込み
      const remainingBudget = maxBudget - currentTotal
      const candidateItems = availableItems.filter((item) => {
        if (item.price > remainingBudget) return false
        if (!allowDuplicates && usedItemIds.has(item.itemId)) return false

        return true
      })

      if (candidateItems.length === 0) break

      // ランダムにアイテムを選択
      const selectedItem = candidateItems[Math.floor(Math.random() * candidateItems.length)]!

      combination.push(selectedItem)
      currentTotal += selectedItem.price

      if (!allowDuplicates) {
        usedItemIds.add(selectedItem.itemId)
      }

      // 予算範囲内に入ったら確定枠として保存し、50%の確率で続行
      if (currentTotal >= minBudget && currentTotal <= maxBudget) {
        confirmedCombination = [...combination]
        if (Math.random() < 0.5) {
          return confirmedCombination
        }
      }
    }
  }

  return confirmedCombination
}

function generateRandomCombinationWithStapleFood(
  otherItems: TMenuItem[],
  stapleFood: TMenuItem,
  minBudget: number,
  maxBudget: number,
  allowDuplicates: boolean,
  maxAttempts: number = 1000,
): null | TMenuItem[] {
  // 価格でソートして効率的な探索を可能にする
  const sortedItems = [...otherItems].toSorted((a, b) => a.price - b.price)
  let confirmedCombination: null | TMenuItem[] = null

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const combination: TMenuItem[] = [stapleFood]
    const usedItemIds = new Set<string>()
    let currentTotal = stapleFood.price

    if (!allowDuplicates) {
      usedItemIds.add(stapleFood.itemId)
    }

    // 予算範囲に入っているかチェック
    if (currentTotal >= minBudget && currentTotal <= maxBudget) {
      confirmedCombination = [...combination]
      if (Math.random() < 0.5) {
        return confirmedCombination
      }
    }

    const availableItems = sortedItems.filter(item => item.price <= maxBudget - stapleFood.price)

    if (availableItems.length === 0 && currentTotal < minBudget) continue

    while (currentTotal < maxBudget) {
      // 残り予算内で選択可能なアイテムを絞り込み
      const remainingBudget = maxBudget - currentTotal
      const candidateItems = availableItems.filter((item) => {
        if (item.price > remainingBudget) return false
        if (!allowDuplicates && usedItemIds.has(item.itemId)) return false

        return true
      })

      if (candidateItems.length === 0) break

      // ランダムにアイテムを選択
      const selectedItem = candidateItems[Math.floor(Math.random() * candidateItems.length)]!

      combination.push(selectedItem)
      currentTotal += selectedItem.price

      if (!allowDuplicates) {
        usedItemIds.add(selectedItem.itemId)
      }

      // 予算範囲内に入ったら確定枠として保存し、50%の確率で続行
      if (currentTotal >= minBudget && currentTotal <= maxBudget) {
        confirmedCombination = [...combination]
        if (Math.random() < 0.5) {
          return confirmedCombination
        }
      }
    }
  }

  return confirmedCombination
}

function pullStapleFoodGacha(
  menuItems: TMenuItem[],
  minBudget: number,
  maxBudget: number,
  options: IGachaOptions,
): Omit<IGachaResult, 'options'> {
  const { allowDuplicates = true } = options
  const stapleFoods = menuItems.filter(item => item.hasStapleFood && item.price <= maxBudget)

  if (stapleFoods.length === 0) {
    return {
      items: [],
      maxBudget,
      minBudget,
      success: false,
      totalAmount: 0,
    }
  }

  // 主食をシャッフルして順番を変える
  const shuffledStapleFoods = [...stapleFoods].toSorted(() => Math.random() - 0.5)

  for (const stapleFood of shuffledStapleFoods) {
    const otherItems = allowDuplicates
      ? menuItems
      : menuItems.filter(item => item.itemId !== stapleFood.itemId)

    // この主食でランダムサンプリング方式で組み合わせを探す
    const validCombination = generateRandomCombinationWithStapleFood(
      otherItems,
      stapleFood,
      minBudget,
      maxBudget,
      allowDuplicates,
    )

    if (validCombination) {
      const totalAmount = validCombination.reduce((sum, item) => sum + item.price, 0)

      return {
        items: validCombination,
        maxBudget,
        minBudget,
        success: true,
        totalAmount,
      }
    }
  }

  // どの主食でも組み合わせが見つからない場合
  return {
    items: [],
    maxBudget,
    minBudget,
    success: false,
    totalAmount: 0,
  }
}
