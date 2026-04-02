import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { FormulaCard } from '../ui/FormulaCard'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import { ITERATIONS } from '../../data/fordFulkersonSteps'
import type { FlowEdge } from '../../types/graph'

// Use flow after iteration 1 for demo (flow = 12: s->v1->v3->t)
// ITERATIONS[0].flowAfter = flow state after first augmentation
// ITERATIONS[1].residualEdges = residual network built from that flow (has back-edges!)
const DEMO_FLOW: readonly FlowEdge[] = ITERATIONS[0].flowAfter.edges
const DEMO_RESIDUAL = ITERATIONS[1].residualEdges

export function S05_ResidualNetwork() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 1: Residual Network', zh: '第一部分：残留网络' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'The Residual Network', zh: '残留网络' })} <span style={{ color: 'var(--accent)' }}>G<sub>f</sub></span>
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>Given a flow f, the <SlideAccent>residual network</SlideAccent> G_f shows remaining capacity and possible flow reversals.</>,
          zh: <>给定流 f，<SlideAccent>残留网络</SlideAccent> G_f 展示了剩余容量和可能的流回退。</>,
        })}
      </SlideDescription>

      <div className="flex gap-6 mt-6 w-full max-w-6xl items-start">
        {/* Original with flow */}
        <div className="flex-1 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm mb-2"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {t({ en: 'Original G with flow f', zh: '原图 G 及流 f' })}
          </motion.p>
          <FlowNetworkGraph
            flowEdges={DEMO_FLOW}
            showFlow
            showParticles
            delay={0.4}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm mt-1"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
          >
            |f| = 12
          </motion.p>
        </div>

        {/* Arrow */}
        <motion.div
          className="flex items-center justify-center pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-3xl" style={{ color: 'var(--text-muted)' }}>{'\u2192'}</span>
        </motion.div>

        {/* Residual network */}
        <AnimatePresence>
          {subStep >= 1 && (
            <motion.div
              className="flex-1 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                {t({ en: 'Residual network Gf', zh: '残留网络 Gf' })}
              </p>
              <FlowNetworkGraph
                residualEdges={DEMO_RESIDUAL}
                delay={0}
              />
              <div className="flex gap-4 justify-center mt-3">
                <span className="flex items-center gap-2 text-sm px-3 py-1 rounded-md" style={{ fontFamily: 'var(--font-mono)', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}>
                  <span className="w-5 h-0.5 inline-block rounded" style={{ background: '#34d399' }} />
                  <span style={{ color: '#34d399' }}>{t({ en: 'forward', zh: '正向边' })}</span>
                </span>
                <span className="flex items-center gap-2 text-sm px-3 py-1 rounded-md" style={{ fontFamily: 'var(--font-mono)', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.3)' }}>
                  <span className="w-5 h-0.5 inline-block rounded" style={{ background: '#c084fc', borderTop: '2px dashed #c084fc' }} />
                  <span style={{ color: '#c084fc' }}>{t({ en: 'back edge', zh: '反向边' })}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {subStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <FormulaCard
              latex={String.raw`E_f = \{(u,v) \in V \times V : c_f(u,v) > 0\}`}
              label={t({ en: 'Residual edges', zh: '残留边集' })}
              delay={0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SlideBase>
  )
}
