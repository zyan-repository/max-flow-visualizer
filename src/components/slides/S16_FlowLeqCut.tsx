import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { FormulaCard } from '../ui/FormulaCard'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { CutLine } from '../graph/CutLine'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import { FINAL_FLOW_STATE, CUT_EXAMPLES } from '../../data/fordFulkersonSteps'

export function S16_FlowLeqCut() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 3: Cut & Theorem', zh: '第三部分：割与定理' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Flow \u2264 Cut', zh: '流 \u2264 割' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>For <SlideAccent>any</SlideAccent> flow f and <SlideAccent>any</SlideAccent> cut (S,T): the value of f cannot exceed the capacity of the cut. Flow must cross every cut!</>,
          zh: <>对<SlideAccent>任意</SlideAccent>流 f 和<SlideAccent>任意</SlideAccent>割 (S,T)：f 的值不能超过割的容量。流必须穿过每一个割！</>,
        })}
      </SlideDescription>

      <motion.div
        className="mt-6 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FlowNetworkGraph
          flowEdges={FINAL_FLOW_STATE.edges}
          showFlow
          showParticles
          cut={subStep >= 1 ? CUT_EXAMPLES[0] : null}
          delay={0.3}
        >
          {subStep >= 1 && (
            <CutLine cut={CUT_EXAMPLES[0]} delay={0.2} />
          )}
        </FlowNetworkGraph>
      </motion.div>

      <AnimatePresence>
        {subStep >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex gap-4 items-center"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <div className="px-4 py-2 rounded-lg" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t({ en: 'Flow', zh: '流' })}</span>
              <br />
              <span className="text-2xl font-medium" style={{ color: '#34d399' }}>23</span>
            </div>
            <span className="text-2xl" style={{ color: 'var(--text-muted)' }}>{'\u2264'}</span>
            <div className="px-4 py-2 rounded-lg" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t({ en: 'Cut capacity', zh: '割容量' })}</span>
              <br />
              <span className="text-2xl font-medium" style={{ color: '#fbbf24' }}>{CUT_EXAMPLES[0].capacity}</span>
            </div>
            <span className="text-lg" style={{ color: '#34d399' }}>{'\u2713'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {subStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <FormulaCard
              latex={String.raw`|f| \leq c(S, T) \quad \text{for any cut } (S, T)`}
              label={t({ en: 'Key lemma', zh: '关键引理' })}
              delay={0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SlideBase>
  )
}
