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

interface IValidTarget {
  budget: number
  value: number
}

export function pullGacha(
  menuItems: TMenuItem[],
  minBudget: number = 800,
  maxBudget: number = 1000,
  options: IGachaOptions = {},
): IGachaResult {
  const {
    allowDuplicates = true,
    requireStapleFood = false,
  } = options

  if (allowDuplicates) {
    return solveWithDuplicates(menuItems, minBudget, maxBudget, requireStapleFood)
  }

  return solveWithoutDuplicates(menuItems, minBudget, maxBudget, requireStapleFood)
}

function solveWithDuplicates(
  menuItems: TMenuItem[],
  minBudget: number,
  maxBudget: number,
  requireStapleFood: boolean,
): IGachaResult {
  const dp: number[] = Array.from({ length: maxBudget + 1 }, () => 0)

  // DP構築
  for (let w = 1; w <= maxBudget; w++) {
    for (const item of menuItems) {
      if (w >= item.price) {
        const prevValue = dp[w - item.price]

        if (prevValue !== undefined) {
          dp[w] = Math.max(dp[w]!, prevValue + item.price)
        }
      }
    }
  }

  // 範囲内で達成可能な金額を全て収集
  const validTargets: IValidTarget[] = []

  for (let w = minBudget; w <= maxBudget; w++) {
    const value = dp[w]

    if (value !== undefined && value >= minBudget && value <= maxBudget) {
      validTargets.push({
        budget: w,
        value,
      })
    }
  }

  if (validTargets.length === 0) {
    return {
      allowDuplicates: true,
      items: [],
      maxBudget,
      minBudget,
      totalAmount: 0,
    }
  }

  // 目標金額をランダムに選択
  const targetObj = validTargets[Math.floor(Math.random() * validTargets.length)]!

  // 組み合わせを生成
  function randomBacktrack(remainingBudget: number, targetValue: number): TMenuItem[] {
    if (targetValue === 0) {
      return []
    }

    const validChoices: {
      index: number
      item: TMenuItem
    }[] = []

    for (const [i, item] of menuItems.entries()) {
      if (remainingBudget >= item.price) {
        const newBudget = remainingBudget - item.price
        const newTarget = targetValue - item.price
        const dpValue = dp[newBudget]

        if (newTarget >= 0 && dpValue !== undefined && dpValue >= newTarget) {
          validChoices.push({
            index: i,
            item,
          })
        }
      }
    }

    if (validChoices.length === 0) {
      return []
    }

    const choice = validChoices[Math.floor(Math.random() * validChoices.length)]!
    const rest = randomBacktrack(
      remainingBudget - choice.item.price,
      targetValue - choice.item.price,
    )

    return [choice.item, ...rest]
  }

  const selectedItems = randomBacktrack(targetObj.budget, targetObj.value)

  // requireStapleFoodオプションが有効な場合、主食が含まれるまで再試行
  if (requireStapleFood && !selectedItems.some(item => item.hasStapleFood)) {
    const stapleFoodItems = menuItems.filter(item => item.hasStapleFood)

    if (stapleFoodItems.length === 0) {
      return {
        allowDuplicates: true,
        items: [],
        maxBudget,
        minBudget,
        totalAmount: 0,
      }
    }

    // 主食を1つ以上含む解を探す
    for (let attempt = 0; attempt < 100; attempt++) {
      const newItems = randomBacktrack(targetObj.budget, targetObj.value)

      if (newItems.some(item => item.hasStapleFood)) {
        return {
          allowDuplicates: true,
          items: newItems,
          maxBudget,
          minBudget,
          totalAmount: targetObj.value,
        }
      }
    }

    // 100回試行しても見つからない場合、主食を強制的に含める
    const cheapestStapleFood = stapleFoodItems.reduce((min, item) =>
      item.price < min.price ? item : min,
    )
    const remainingBudget = targetObj.value - cheapestStapleFood.price

    if (remainingBudget >= 0) {
      const otherItems = randomBacktrack(targetObj.budget - cheapestStapleFood.price, remainingBudget)

      return {
        allowDuplicates: true,
        items: [cheapestStapleFood, ...otherItems],
        maxBudget,
        minBudget,
        totalAmount: cheapestStapleFood.price + otherItems.reduce((sum, item) => sum + item.price, 0),
      }
    }

    return {
      allowDuplicates: true,
      items: [cheapestStapleFood],
      maxBudget,
      minBudget,
      totalAmount: cheapestStapleFood.price,
    }
  }

  return {
    allowDuplicates: true,
    items: selectedItems,
    maxBudget,
    minBudget,
    totalAmount: targetObj.value,
  }
}

function solveWithoutDuplicates(
  menuItems: TMenuItem[],
  minBudget: number,
  maxBudget: number,
  requireStapleFood: boolean,
): IGachaResult {
  const n = menuItems.length

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: maxBudget + 1 }, () => 0),
  )

  // DP構築
  for (let i = 1; i <= n; i++) {
    const item = menuItems[i - 1]

    for (let w = 0; w <= maxBudget; w++) {
      const prevValue = dp[i - 1]?.[w]

      if (prevValue !== undefined) {
        dp[i]![w] = prevValue
      }

      if (item && w >= item.price) {
        const dpValue = dp[i - 1]?.[w - item.price]

        if (dpValue !== undefined) {
          dp[i]![w] = Math.max(
            dp[i]![w]!,
            dpValue + item.price,
          )
        }
      }
    }
  }

  // 範囲内で達成可能な金額を全て収集
  const validTargets: IValidTarget[] = []

  for (let w = minBudget; w <= maxBudget; w++) {
    const value = dp[n]?.[w]

    if (value !== undefined && value >= minBudget && value <= maxBudget) {
      validTargets.push({
        budget: w,
        value,
      })
    }
  }

  if (validTargets.length === 0) {
    return {
      allowDuplicates: false,
      items: [],
      maxBudget,
      minBudget,
      totalAmount: 0,
    }
  }

  // 目標金額をランダムに選択
  const targetObj = validTargets[Math.floor(Math.random() * validTargets.length)]!

  // 組み合わせを生成
  function randomBacktrack(i: number, remainingBudget: number, targetValue: number): TMenuItem[] {
    if (targetValue === 0) {
      return []
    }

    if (i === 0) {
      return []
    }

    const item = menuItems[i - 1]
    const validChoices: { use: boolean }[] = []

    const dpPrevBudget = dp[i - 1]?.[remainingBudget]

    if (dpPrevBudget !== undefined && dpPrevBudget >= targetValue) {
      validChoices.push({ use: false })
    }

    if (item && remainingBudget >= item.price) {
      const newBudget = remainingBudget - item.price
      const newTarget = targetValue - item.price
      const dpNewBudget = dp[i - 1]?.[newBudget]

      if (newTarget >= 0 && dpNewBudget !== undefined && dpNewBudget >= newTarget) {
        validChoices.push({ use: true })
      }
    }

    if (validChoices.length === 0) {
      return []
    }

    const choice = validChoices[Math.floor(Math.random() * validChoices.length)]!

    if (choice.use && item) {
      const rest = randomBacktrack(
        i - 1,
        remainingBudget - item.price,
        targetValue - item.price,
      )

      return [...rest, item]
    }

    return randomBacktrack(i - 1, remainingBudget, targetValue)
  }

  const selectedItems = randomBacktrack(n, targetObj.budget, targetObj.value)

  // requireStapleFoodオプションが有効な場合、主食が含まれるまで再試行
  if (requireStapleFood && !selectedItems.some(item => item.hasStapleFood)) {
    const stapleFoodItems = menuItems.filter(item => item.hasStapleFood)

    if (stapleFoodItems.length === 0) {
      return {
        allowDuplicates: false,
        items: [],
        maxBudget,
        minBudget,
        totalAmount: 0,
      }
    }

    // 主食を1つ以上含む解を探す
    for (let attempt = 0; attempt < 100; attempt++) {
      const newItems = randomBacktrack(n, targetObj.budget, targetObj.value)

      if (newItems.some(item => item.hasStapleFood)) {
        return {
          allowDuplicates: false,
          items: newItems,
          maxBudget,
          minBudget,
          totalAmount: targetObj.value,
        }
      }
    }

    // 100回試行しても見つからない場合、主食を含む新しい解を探す
    // この場合、主食を必ず含むようにDPを再構築する必要がある
    const stapleFoodIndices = new Set(
      menuItems
        .map((item, idx) => (item.hasStapleFood ? idx : -1))
        .filter(idx => idx !== -1),
    )

    // 各主食を基準に解を探す
    for (const stapleFoodIdx of stapleFoodIndices) {
      const stapleFoodItem = menuItems[stapleFoodIdx]

      if (!stapleFoodItem || stapleFoodItem.price > maxBudget) {
        continue
      }

      // 主食を含む残りのアイテムで解を探す
      const otherItems = menuItems.filter((_, idx) => idx !== stapleFoodIdx)
      const remainingBudget = targetObj.value - stapleFoodItem.price

      if (remainingBudget < 0) {
        continue
      }

      if (remainingBudget === 0) {
        return {
          allowDuplicates: false,
          items: [stapleFoodItem],
          maxBudget,
          minBudget,
          totalAmount: stapleFoodItem.price,
        }
      }

      // 残りのアイテムでDPを実行
      const m = otherItems.length
      const dpOther: number[][] = Array.from({ length: m + 1 }, () =>
        Array.from({ length: remainingBudget + 1 }, () => 0),
      )

      for (let i = 1; i <= m; i++) {
        const item = otherItems[i - 1]

        for (let w = 0; w <= remainingBudget; w++) {
          const prevValue = dpOther[i - 1]?.[w]

          if (prevValue !== undefined) {
            dpOther[i]![w] = prevValue
          }

          if (item && w >= item.price) {
            const dpValue = dpOther[i - 1]?.[w - item.price]

            if (dpValue !== undefined) {
              dpOther[i]![w] = Math.max(
                dpOther[i]![w]!,
                dpValue + item.price,
              )
            }
          }
        }
      }

      // remainingBudgetでちょうど達成可能かチェック
      const achievable = dpOther[m]?.[remainingBudget]

      if (achievable === remainingBudget) {
        // バックトラック関数（主食以外のアイテム用）
        function backtrackOther(i: number, budget: number, target: number): TMenuItem[] {
          if (target === 0) {
            return []
          }

          if (i === 0) {
            return []
          }

          const item = otherItems[i - 1]
          const dpPrevBudget = dpOther[i - 1]?.[budget]

          if (dpPrevBudget !== undefined && dpPrevBudget >= target) {
            return backtrackOther(i - 1, budget, target)
          }

          if (item && budget >= item.price) {
            const newBudget = budget - item.price
            const newTarget = target - item.price
            const dpNewBudget = dpOther[i - 1]?.[newBudget]

            if (newTarget >= 0 && dpNewBudget !== undefined && dpNewBudget >= newTarget) {
              const rest = backtrackOther(i - 1, newBudget, newTarget)

              return [...rest, item]
            }
          }

          return []
        }

        const otherSelectedItems = backtrackOther(m, remainingBudget, remainingBudget)

        return {
          allowDuplicates: false,
          items: [stapleFoodItem, ...otherSelectedItems],
          maxBudget,
          minBudget,
          totalAmount: stapleFoodItem.price + otherSelectedItems.reduce((sum, item) => sum + item.price, 0),
        }
      }
    }

    // どうしても見つからない場合は空の結果を返す
    return {
      allowDuplicates: false,
      items: [],
      maxBudget,
      minBudget,
      totalAmount: 0,
    }
  }

  return {
    allowDuplicates: false,
    items: selectedItems,
    maxBudget,
    minBudget,
    totalAmount: targetObj.value,
  }
}
