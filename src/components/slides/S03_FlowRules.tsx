import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideContext } from '../ui/SlideBase'
import { FormulaCard } from '../ui/FormulaCard'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import type { FlowEdge } from '../../types/graph'
import { EDGES } from '../../data/exampleGraph'

// Example flow to demonstrate rules
const EXAMPLE_FLOW: readonly FlowEdge[] = EDGES.map(e => ({
  ...e,
  flow: e.from === 's' && e.to === 'v1' ? 8
    : e.from === 'v1' && e.to === 'v3' ? 8
    : e.from === 'v3' && e.to === 't' ? 8
    : 0,
}))

export function S03_FlowRules() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 1: Residual Network', zh: '第一部分：残留网络' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Rules of Flow', zh: '流的规则' })}
      </SlideHeading>

      <div className="flex gap-8 mt-4 w-full max-w-6xl items-start">
        {/* Left: Rules */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.2 }}
          >
            <FormulaCard
              latex={String.raw`0 \leq f(u,v) \leq c(u,v)`}
              label={t({ en: 'Capacity Constraint', zh: '容量约束' })}
              delay={0}
            />
            <p className="text-sm mt-2 pl-2" style={{ color: 'var(--text-secondary)' }}>
              {t({
                en: 'Flow on each edge cannot exceed its capacity',
                zh: '每条边上的流不能超过其容量',
              })}
            </p>
          </motion.div>

          <AnimatePresence>
            {subStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                <FormulaCard
                  latex={String.raw`\sum_{v \in V} f(v,u) = \sum_{v \in V} f(u,v) \quad \forall u \in V \setminus \{s,t\}`}
                  label={t({ en: 'Flow Conservation', zh: '流守恒' })}
                  delay={0}
                />
                <p className="text-sm mt-2 pl-2" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'For every node except s and t: flow in = flow out',
                    zh: '对每个非 s、t 节点：流入 = 流出',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {subStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                <FormulaCard
                  latex={String.raw`|f| = \sum_{v \in V} f(s,v) - \sum_{v \in V} f(v,s)`}
                  label={t({ en: 'Flow Value', zh: '流的值' })}
                  delay={0}
                />
                <p className="text-sm mt-2 pl-2" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'The total flow from source = net outflow from s',
                    zh: '总流量 = 从源点 s 的净流出',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Graph with example flow */}
        <div className="flex-1">
          <FlowNetworkGraph
            flowEdges={subStep >= 1 ? EXAMPLE_FLOW : undefined}
            showFlow={subStep >= 1}
            showParticles={subStep >= 2}
            delay={0.3}
          />
          {subStep >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-2"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
            >
              |f| = 8
            </motion.div>
          )}
        </div>
      </div>
    </SlideBase>
  )
}
