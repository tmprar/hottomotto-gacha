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

  // 主食不要の場合は全組み合わせから選択
  const validCombinations = generateCombinations(
    menuItems,
    minBudget,
    maxBudget,
    false,
    allowDuplicates,
  )

  if (validCombinations.length === 0) {
    return {
      items: [],
      maxBudget,
      minBudget,
      options,
      success: false,
      totalAmount: 0,
    }
  }

  const selectedCombination = validCombinations[Math.floor(Math.random() * validCombinations.length)]!
  const totalAmount = selectedCombination.reduce((sum, item) => sum + item.price, 0)

  return {
    items: selectedCombination,
    maxBudget,
    minBudget,
    options,
    success: true,
    totalAmount,
  }
}

function generateCombinations(
  menuItems: TMenuItem[],
  minBudget: number,
  maxBudget: number,
  requireStapleFood: boolean,
  allowDuplicates: boolean,
): TMenuItem[][] {
  const validCombinations: TMenuItem[][] = []

  function backtrack(
    currentCombination: TMenuItem[],
    currentTotal: number,
    startIndex: number,
    usedItemIds: Set<string>,
  ) {
    // 予算範囲内で主食条件を満たしている場合は有効な組み合わせとして追加
    if (currentTotal >= minBudget && currentTotal <= maxBudget) {
      const hasStapleFood = currentCombination.some(item => item.hasStapleFood)

      if (!requireStapleFood || hasStapleFood) {
        validCombinations.push([...currentCombination])
      }
    }

    // 最大予算を超えた場合は探索を停止
    if (currentTotal >= maxBudget) {
      return
    }

    // 残りのアイテムを試す
    for (let i = startIndex; i < menuItems.length; i++) {
      const item = menuItems[i]!

      // 予算オーバーの場合はスキップ
      if (currentTotal + item.price > maxBudget) continue

      // 重複不可で既に使用済みの場合はスキップ
      if (!allowDuplicates && usedItemIds.has(item.itemId)) continue

      // アイテムを追加して再帰的に探索
      currentCombination.push(item)
      const newUsedIds = new Set(usedItemIds)

      if (!allowDuplicates) {
        newUsedIds.add(item.itemId)
      }

      backtrack(
        currentCombination,
        currentTotal + item.price,
        allowDuplicates ? i : i + 1,
        newUsedIds,
      )

      // バックトラック
      currentCombination.pop()
    }
  }

  backtrack([], 0, 0, new Set())

  return validCombinations
}

function generateCombinationsWithStapleFood(
  otherItems: TMenuItem[],
  stapleFood: TMenuItem,
  minBudget: number,
  maxBudget: number,
  allowDuplicates: boolean,
): TMenuItem[][] {
  const validCombinations: TMenuItem[][] = []

  function backtrack(
    currentCombination: TMenuItem[],
    currentTotal: number,
    startIndex: number,
    usedItemIds: Set<string>,
  ) {
    // 予算範囲内の場合は有効な組み合わせとして追加
    if (currentTotal >= minBudget && currentTotal <= maxBudget) {
      validCombinations.push([...currentCombination])
    }

    // 残り予算を超えた場合は探索を停止
    if (currentTotal >= maxBudget) {
      return
    }

    // 残りのアイテムを試す
    for (let i = startIndex; i < otherItems.length; i++) {
      const item = otherItems[i]!

      // 予算オーバーの場合はスキップ
      if (currentTotal + item.price > maxBudget) continue

      // 重複不可で既に使用済みの場合はスキップ
      if (!allowDuplicates && usedItemIds.has(item.itemId)) continue

      // アイテムを追加して再帰的に探索
      currentCombination.push(item)
      const newUsedIds = new Set(usedItemIds)

      if (!allowDuplicates) {
        newUsedIds.add(item.itemId)
      }

      backtrack(
        currentCombination,
        currentTotal + item.price,
        allowDuplicates ? i : i + 1,
        newUsedIds,
      )

      // バックトラック
      currentCombination.pop()
    }
  }

  // 主食から開始
  const initialUsedIds = new Set<string>()

  if (!allowDuplicates) {
    initialUsedIds.add(stapleFood.itemId)
  }

  backtrack([stapleFood], stapleFood.price, 0, initialUsedIds)

  return validCombinations
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

    // この主食で組み合わせを探す
    const validCombinations = generateCombinationsWithStapleFood(
      otherItems,
      stapleFood,
      minBudget,
      maxBudget,
      allowDuplicates,
    )

    if (validCombinations.length > 0) {
      const selectedCombination = validCombinations[Math.floor(Math.random() * validCombinations.length)]!
      const totalAmount = selectedCombination.reduce((sum, item) => sum + item.price, 0)

      return {
        items: selectedCombination,
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
