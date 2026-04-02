import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { FormulaCard } from '../ui/FormulaCard'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { CutLine } from '../graph/CutLine'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import { CUT_EXAMPLES } from '../../data/fordFulkersonSteps'

export function S14_CutDefinition() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 3: Cut & Theorem', zh: '第三部分：割与定理' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'What is a Cut?', zh: '什么是割？' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>A <SlideAccent>cut</SlideAccent> (S, T) partitions vertices into two sets: S contains source s, T contains sink t. The capacity of a cut is the sum of capacities of edges crossing from S to T.</>,
          zh: <><SlideAccent>割</SlideAccent> (S, T) 将顶点分为两组：S 包含源点 s，T 包含汇点 t。割的容量是从 S 到 T 的边容量之和。</>,
        })}
      </SlideDescription>

      <motion.div
        className="mt-6 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FlowNetworkGraph
          cut={subStep >= 1 ? CUT_EXAMPLES[0] : null}
          delay={0.3}
        >
          {subStep >= 1 && (
            <CutLine cut={CUT_EXAMPLES[0]} delay={0.3} />
          )}
        </FlowNetworkGraph>
      </motion.div>

      <AnimatePresence>
        {subStep >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center"
          >
            <span className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              S = {'{'}{CUT_EXAMPLES[0].S.join(', ')}{'}'}, T = {'{'}{CUT_EXAMPLES[0].T.join(', ')}{'}'}
            </span>
            <br />
            <span className="text-sm" style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              c(S, T) = {CUT_EXAMPLES[0].cutEdges.map(e => e.capacity).join(' + ')} = {CUT_EXAMPLES[0].capacity}
            </span>
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
              latex={String.raw`c(S, T) = \sum_{u \in S} \sum_{v \in T} c(u, v)`}
              label={t({ en: 'Cut capacity', zh: '割的容量' })}
              delay={0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SlideBase>
  )
}
