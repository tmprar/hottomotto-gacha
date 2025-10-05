<script setup lang="ts">
import confetti from 'canvas-confetti'
import {
  Button,
  Card,
  Divider,
  Panel,
  SelectButton,
  Slider,
  Tag,
  ToggleSwitch,
} from 'primevue'

import type {
  Allergen,
  IGachaResult,
  TMenuItem,
} from '~/utils/gacha'

import {
  ALLERGEN_METADATA,
  pullGacha,
} from '~/utils/gacha'

const pageTitle = 'ほっともっと 800円ガチャ'
const pageDescription = 'ほっともっとのメニューでガチャしよう！'

useHead({
  meta: [
    {
      content: pageDescription,
      name: 'description',
    },
    {
      content: pageTitle,
      name: 'og:title',
      property: 'og:title',
    },
    {
      content: pageDescription,
      name: 'og:description',
      property: 'og:description',
    },
    {
      content: '@tmprar',
      name: 'twitter:site',
    },
    {
      content: 'summary',
      name: 'twitter:card',
    },
    {
      content: pageTitle,
      name: 'twitter:title',
    },
    {
      content: pageDescription,
      name: 'twitter:description',
    },
  ],
  title: pageTitle,
})

const toNumberFormat = (value: number, options?: { style?: 'none' | keyof Intl.NumberFormatOptionsStyleRegistry }) => new Intl.NumberFormat('ja-JP', {
  currency: 'JPY',
  currencyDisplay: 'name',
  style: options?.style ? (options.style === 'none' ? undefined : options.style) : 'currency',
}).format(value)

const toNumberRangeFormat = (min: number, max: number) => `${toNumberFormat(min, { style: 'none' })}〜${toNumberFormat(max)}`

enum Mode {
  BASIC = 'basic',
  PREMIUM = 'premium',
  STANDARD = 'standard',
}

const MODE_METADATA = {
  [Mode.BASIC]: {
    description: toNumberFormat(800),
    label: '梅',
    maxBudget: 800,
    minBudget: 800,
    value: Mode.BASIC,
  },
  [Mode.PREMIUM]: {
    description: toNumberRangeFormat(800, 1000),
    label: '松',
    maxBudget: 1000,
    minBudget: 800,
    value: Mode.PREMIUM,
  },
  [Mode.STANDARD]: {
    description: toNumberRangeFormat(800, 850),
    label: '竹',
    maxBudget: 850,
    minBudget: 800,
    value: Mode.STANDARD,
  },
}

const state = ref<{
  allowDuplicates: boolean
  maxBudget: number
  minBudget: number
  requireStapleFood: boolean
  result?: IGachaResult
}>({
  allowDuplicates: false,
  maxBudget: 800,
  minBudget: 800,
  requireStapleFood: true,
  result: undefined,
})

const menuItems = ref<TMenuItem[]>([])

const handlePullGacha = async () => {
  const result = pullGacha(
    menuItems.value,
    state.value.minBudget,
    state.value.maxBudget,
    {
      allowDuplicates: state.value.allowDuplicates,
      requireStapleFood: state.value.requireStapleFood,
    },
  )

  state.value.result = result

  if (result.items.length > 0) {
    await confetti({
      particleCount: 90,
      spread: 90,
    })
  }
}

const gachaMode = computed({
  get: () => {
    if (
      state.value.minBudget === MODE_METADATA[Mode.BASIC].minBudget
      && state.value.maxBudget === MODE_METADATA[Mode.BASIC].maxBudget
    ) {
      return Mode.BASIC
    }
    if (
      state.value.minBudget === MODE_METADATA[Mode.STANDARD].minBudget
      && state.value.maxBudget === MODE_METADATA[Mode.STANDARD].maxBudget
    ) {
      return Mode.STANDARD
    }
    if (
      state.value.minBudget === MODE_METADATA[Mode.PREMIUM].minBudget
      && state.value.maxBudget === MODE_METADATA[Mode.PREMIUM].maxBudget
    ) {
      return Mode.PREMIUM
    }

    return null
  },
  set: (gachaMode) => {
    switch (gachaMode) {
      case Mode.PREMIUM: {
        state.value.minBudget = MODE_METADATA[Mode.PREMIUM].minBudget
        state.value.maxBudget = MODE_METADATA[Mode.PREMIUM].maxBudget
        break
      }
      case Mode.STANDARD: {
        state.value.minBudget = MODE_METADATA[Mode.STANDARD].minBudget
        state.value.maxBudget = MODE_METADATA[Mode.STANDARD].maxBudget
        break
      }
      default: {
        state.value.minBudget = MODE_METADATA[Mode.BASIC].minBudget
        state.value.maxBudget = MODE_METADATA[Mode.BASIC].minBudget
      }
    }
  },
})

const budget = computed({
  get: () => [state.value.minBudget, state.value.maxBudget],
  set: (budget) => {
    const budget0 = budget[0]
    const budget1 = budget[1]

    if (budget0 == undefined || budget1 == undefined) {
      state.value.minBudget = 800
      state.value.maxBudget = 800

      return
    }

    const minBudget = Math.min(budget0, budget1)
    const maxBudget = Math.max(budget0, budget1)

    state.value.minBudget = minBudget
    state.value.maxBudget = maxBudget
  },
})

const shareToX = () => {
  if (!state.value.result || state.value.result.items.length === 0) {
    return
  }

  const items = state.value.result.items.map(item => `・${item.name} ${toNumberFormat(item.price)}`).join('\n')
  const total = toNumberFormat(state.value.result.totalAmount)
  const budget = state.value.minBudget === state.value.maxBudget
    ? toNumberFormat(state.value.minBudget)
    : toNumberRangeFormat(state.value.minBudget, state.value.maxBudget)
  const text = `ほっともっと ${budget}ガチャ\n\n${items}\n\n合計: ${total}`
  const url = globalThis.location.href
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

  window.open(twitterUrl, '_blank')
}

void (async () => {
  const json = await $fetch<{ items: TMenuItem[] }>('/items.json')

  menuItems.value = json.items
})()
</script>

<template>
  <div class="p-4 flex justify-center bg-gradient-to-r from-red-500 to-orange-500 w-dvw h-dvh">
    <div class="w-[640px] h-full max-w-full flex flex-col gap-4">
      <Card class="flex-grow overflow-auto">
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex justify-center gap-2">
              <div class="text-2xl font-bold">
                ほっともっと 800円ガチャ
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap gap-2">
                <SelectButton
                  v-model="gachaMode"
                  :allow-empty="false"
                  option-label="label"
                  option-value="value"
                  :options="[MODE_METADATA[Mode.PREMIUM], MODE_METADATA[Mode.STANDARD], MODE_METADATA[Mode.BASIC]]"
                  :pt="{root: 'w-full sm:w-86 max-w-full', pcToggleButton: {root: 'flex-1', content: 'w-full'}}"
                >
                  <template #option="slotProps">
                    <div class="w-full flex flex-col">
                      <div class="text-xl">
                        {{ slotProps.option.label }}
                      </div>
                      <div
                        class="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-pre-wrap break-keep"
                        :style="{display: '-webkit-box', boxOrient: 'vertical', lineClamp: 2}"
                      >
                        {{ slotProps.option.description }}
                      </div>
                    </div>
                  </template>
                </SelectButton>
                <div class="flex flex-col gap-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <ToggleSwitch v-model="state.allowDuplicates" />
                    重複可
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <ToggleSwitch v-model="state.requireStapleFood" />
                    主食確定
                  </label>
                </div>
                <div class="flex-grow flex items-end justify-end">
                  <Button
                    class="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-none"
                    label="ガチャを回す"
                    @click="handlePullGacha()"
                  />
                </div>
              </div>

              <Panel
                :collapsed="false"
                header="詳細設定"
                toggleable
              >
                <template #toggleicon="slotProps">
                  <i
                    v-if="slotProps.collapsed"
                    class="i-mdi-chevron-down"
                  />
                  <i
                    v-else
                    class="i-mdi-chevron-up"
                  />
                </template>

                <div>
                  <div class="flex flex-col gap-2">
                    <div class="mb-1">
                      予算 {{ toNumberRangeFormat(state.minBudget, state.maxBudget) }}
                    </div>
                    <Slider
                      v-model="budget"
                      :max="1500"
                      :min="500"
                      range
                      :step="50"
                    />
                  </div>
                </div>
              </Panel>

              <div class="text-xs flex flex-col gap-1">
                <div>※有志により開発された非公式サイトです。</div>
                <div>※店舗によって取扱商品や価格が異なる場合があります。ご注意ください。</div>
              </div>
            </div>

            <Divider />

            <div
              v-if="state.result"
            >
              <div
                v-if="state.result.items.length > 0"
                class="flex flex-col gap-2"
              >
                <div
                  v-for="(item, index) in state.result.items"
                  :key="index"
                  class="border-l-4 border-red-500 p-2 flex gap-2"
                >
                  <div class="flex flex-col gap-1">
                    <div class="text-lg">
                      {{ item.name }}
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <Tag
                        v-if="item.hasStapleFood"
                        class="text-xs"
                        severity="info"
                        value="主食"
                      />
                      <Tag
                        v-for="customizeItem in item.customizeItems"
                        :key="customizeItem.itemId"
                        class="text-xs"
                        severity="success"
                        :value="`${customizeItem.name} ${toNumberFormat(customizeItem.price)}`"
                      />
                      <Tag
                        v-if="item.isAlcohol"
                        class="text-xs"
                        severity="secondary"
                        value="アルコール"
                      />
                      <Tag
                        v-for="allergen in item.allergens"
                        :key="allergen"
                        class="text-xs"
                        severity="warn"
                        :value="ALLERGEN_METADATA[allergen as Allergen].label"
                      />
                    </div>
                  </div>
                  <div class="flex-grow flex items-center justify-end">
                    <div class="text-lg whitespace-pre-wrap break-keep">
                      {{ toNumberFormat(item.price) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                該当する組み合わせが存在しませんでした。
              </div>

              <div class="mt-2 flex flex-col gap-2">
                <Divider />

                <div class="text-lg text-right p-2">
                  {{ toNumberFormat(state.result.totalAmount) }}
                </div>

                <div class="flex justify-end">
                  <Button
                    icon="i-mdi-twitter"
                    label="結果をシェア"
                    severity="contrast"
                    @click="shareToX()"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
