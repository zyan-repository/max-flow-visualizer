import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import { CUT_EXAMPLES } from '../../data/fordFulkersonSteps'

export function S15_CutExamples() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  const currentCutIdx = Math.min(subStep, CUT_EXAMPLES.length - 1)
  const currentCut = CUT_EXAMPLES[currentCutIdx]

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 3: Cut & Theorem', zh: '第三部分：割与定理' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Comparing Cuts', zh: '比较不同的割' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>Different cuts have different capacities. Which one is the <SlideAccent>minimum</SlideAccent>?</>,
          zh: <>不同的割有不同的容量。哪个是<SlideAccent>最小</SlideAccent>的？</>,
        })}
      </SlideDescription>

      <motion.div
        className="mt-6 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <FlowNetworkGraph
          key={currentCutIdx}
          cut={currentCut}
          delay={0}
        />

        {/* Cut edges breakdown */}
        <motion.div
          key={`cutinfo-${currentCutIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 flex items-center justify-center gap-2 text-sm"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span style={{ color: '#f87171' }}>
            {t({ en: 'Cut edges:', zh: '割边：' })}
          </span>
          {currentCut.cutEdges.map((e, i) => (
            <span key={i} className="flex items-center gap-1">
              <span style={{ color: '#f87171' }}>{e.from}{'\u2192'}{e.to}({e.capacity})</span>
              {i < currentCut.cutEdges.length - 1 && <span style={{ color: 'var(--text-muted)' }}>+</span>}
            </span>
          ))}
          <span style={{ color: 'var(--text-muted)' }}>=</span>
          <span className="font-medium" style={{ color: currentCutIdx === 2 ? '#34d399' : '#fbbf24' }}>
            {currentCut.capacity}
          </span>
        </motion.div>
      </motion.div>

      {/* Cut comparison bars */}
      <motion.div
        className="mt-6 w-full max-w-xl flex flex-col gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {CUT_EXAMPLES.map((cut, i) => {
          const isVisible = i <= subStep
          const isActive = i === currentCutIdx
          const isMin = i === CUT_EXAMPLES.length - 1
          const barWidth = (cut.capacity / 30) * 100

          return (
            <AnimatePresence key={i}>
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm w-32 shrink-0 text-right" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {'{'}{cut.S.join(',')}{'}'}
                  </span>
                  <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: 'var(--color-zinc-900)' }}>
                    <motion.div
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      style={{
                        background: isMin && isActive
                          ? 'linear-gradient(90deg, rgba(52,211,153,0.3), rgba(52,211,153,0.6))'
                          : isActive
                            ? 'linear-gradient(90deg, rgba(251,191,36,0.3), rgba(251,191,36,0.6))'
                            : 'linear-gradient(90deg, rgba(113,113,122,0.2), rgba(113,113,122,0.4))',
                        boxShadow: isActive ? `0 0 16px ${isMin ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}` : 'none',
                      }}
                    >
                      <span className="text-sm font-medium tabular-nums" style={{ color: isMin && isActive ? '#34d399' : isActive ? '#fbbf24' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {cut.capacity}
                      </span>
                    </motion.div>
                  </div>
                  {isMin && isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399', fontFamily: 'var(--font-mono)' }}
                    >
                      MIN!
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}
      </motion.div>
    </SlideBase>
  )
}
