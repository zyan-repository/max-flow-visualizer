export interface SlideConfig {
  readonly id: string
  readonly title: { readonly en: string; readonly zh: string }
  readonly presenter: 1 | 2 | 3
  readonly durationHint: number
  readonly maxSubStep: number
}

export type Locale = 'en' | 'zh'
export type Direction = 'forward' | 'backward'

export const PRESENTER_COLORS = {
  1: '#38bdf8', // sky-400
  2: '#34d399', // emerald-400
  3: '#fbbf24', // amber-400
} as const

export const PRESENTER_NAMES = {
  1: { en: 'Residual Network', zh: '残留网络' },
  2: { en: 'Augmenting Path', zh: '增广路径' },
  3: { en: 'Cut & Theorem', zh: '割与定理' },
} as const
