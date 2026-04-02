import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePresentation } from '../store/usePresentation'
import { SLIDES } from '../data/slideConfig'
import { PRESENTER_COLORS, PRESENTER_NAMES } from '../types/slide'
import { useT } from '../hooks/useT'

interface SlideLayoutProps {
  children: ReactNode
}

export function SlideLayout({ children }: SlideLayoutProps) {
  const { currentSlide, goToSlide } = usePresentation()
  const t = useT()
  const slide = SLIDES[currentSlide]
  const presenterColor = PRESENTER_COLORS[slide.presenter]
  const presenterName = t(PRESENTER_NAMES[slide.presenter])

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Bottom bar */}
      <div className="h-12 px-6 flex items-center justify-between shrink-0" style={{ borderTop: '1px solid var(--color-zinc-900)' }}>
        {/* Presenter indicator */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: presenterColor, boxShadow: `0 0 8px ${presenterColor}60` }}
            layoutId="presenter-dot"
          />
          <span className="text-sm" style={{ color: presenterColor, fontFamily: 'var(--font-mono)' }}>
            {presenterName}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-8 flex gap-0.5 h-1 rounded-full overflow-hidden">
          {SLIDES.map((s, i) => {
            const color = PRESENTER_COLORS[s.presenter]
            const isActive = i === currentSlide
            const isPast = i < currentSlide
            return (
              <button
                key={s.id}
                onClick={() => goToSlide(i)}
                className="flex-1 relative transition-opacity duration-300 cursor-pointer"
                style={{
                  background: isPast || isActive ? color : `${color}30`,
                  opacity: isActive ? 1 : isPast ? 0.6 : 0.3,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="progress-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 8px ${color}80` }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Slide counter */}
        <span className="text-sm tabular-nums" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {String(currentSlide + 1).padStart(2, '0')} / {SLIDES.length}
        </span>
      </div>
    </div>
  )
}
