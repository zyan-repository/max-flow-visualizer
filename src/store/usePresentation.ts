import { create } from 'zustand'
import type { Direction, Locale } from '../types/slide'
import { SLIDES } from '../data/slideConfig'

interface PresentationState {
  currentSlide: number
  subStep: number
  locale: Locale
  direction: Direction
  showNotes: boolean

  nextSlide: () => void
  prevSlide: () => void
  nextSubStep: () => void
  prevSubStep: () => void
  goToSlide: (index: number) => void
  toggleLocale: () => void
  toggleNotes: () => void
}

export const usePresentation = create<PresentationState>((set, get) => ({
  currentSlide: 0,
  subStep: 0,
  locale: 'en',
  direction: 'forward',
  showNotes: false,

  nextSlide: () => {
    const { currentSlide } = get()
    if (currentSlide < SLIDES.length - 1) {
      set({ currentSlide: currentSlide + 1, subStep: 0, direction: 'forward' })
    }
  },

  prevSlide: () => {
    const { currentSlide } = get()
    if (currentSlide > 0) {
      set({ currentSlide: currentSlide - 1, subStep: 0, direction: 'backward' })
    }
  },

  nextSubStep: () => {
    const { currentSlide, subStep } = get()
    const maxSub = SLIDES[currentSlide].maxSubStep
    if (subStep < maxSub) {
      set({ subStep: subStep + 1 })
    } else {
      get().nextSlide()
    }
  },

  prevSubStep: () => {
    const { subStep } = get()
    if (subStep > 0) {
      set({ subStep: subStep - 1 })
    } else {
      get().prevSlide()
    }
  },

  goToSlide: (index: number) => {
    const { currentSlide } = get()
    if (index >= 0 && index < SLIDES.length) {
      set({
        currentSlide: index,
        subStep: 0,
        direction: index > currentSlide ? 'forward' : 'backward',
      })
    }
  },

  toggleLocale: () => {
    set(s => ({ locale: s.locale === 'en' ? 'zh' : 'en' }))
  },

  toggleNotes: () => {
    set(s => ({ showNotes: !s.showNotes }))
  },
}))
