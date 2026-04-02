import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext, SlideBridge } from '../ui/SlideBase'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import { EDGES } from '../../data/exampleGraph'
import type { ResidualEdge } from '../../types/graph'
import { useMemo } from 'react'

// Build residual edges step by step from iteration 1's flow
const DEMO_FLOW_MAP: Record<string, number> = {
  's->v1': 12,
  'v1->v3': 12,
  'v3->t': 12,
}

// Edges to examine one by one
const EDGE_STEPS = EDGES.map(e => {
  const key = `${e.from}->${e.to}`
  const flow = DEMO_FLOW_MAP[key] ?? 0
  const forwardResidual = e.capacity - flow
  const backResidual = flow
  return { ...e, flow, forwardResidual, backResidual }
})

// Build partial residual edges for first N original edges examined
function buildPartialResidual(edgeCount: number): readonly ResidualEdge[] {
  const result: ResidualEdge[] = []
  for (let i = 0; i < edgeCount; i++) {
    const e = EDGE_STEPS[i]
    if (e.forwardResidual > 0) {
      result.push({
        from: e.from, to: e.to, capacity: e.forwardResidual,
        isBackEdge: false, originalFrom: e.from, originalTo: e.to,
      })
    }
    if (e.backResidual > 0) {
      result.push({
        from: e.to, to: e.from, capacity: e.backResidual,
        isBackEdge: true, originalFrom: e.from, originalTo: e.to,
      })
    }
  }
  return result
}

export function S06_BuildResidual() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  // Show edges up to current substep (each substep reveals ~2-3 edges)
  const visibleEdgeCount = Math.min(EDGE_STEPS.length, (subStep + 1) * 3)

  // Build residual edges progressively
  const partialResidual = useMemo(() => buildPartialResidual(visibleEdgeCount), [visibleEdgeCount])

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 1: Residual Network', zh: '第一部分：残留网络' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Building', zh: '构建' })} G<sub>f</sub> {t({ en: 'Step by Step', zh: '逐步进行' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>Given flow |f| = 12 (path s{'\u2192'}v1{'\u2192'}v3{'\u2192'}t), let's build the residual network <SlideAccent>edge by edge</SlideAccent>.</>,
          zh: <>给定流 |f| = 12（路径 s{'\u2192'}v1{'\u2192'}v3{'\u2192'}t），让我们<SlideAccent>逐条边</SlideAccent>构建残留网络。</>,
        })}
      </SlideDescription>

      <div className="flex gap-6 mt-4 w-full max-w-6xl items-start">
        {/* Left: Table */}
        <div className="flex-1 overflow-hidden">
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-zinc-800)', background: 'rgba(24,24,27,0.6)' }}>
            {/* Header */}
            <div className="grid grid-cols-6 gap-1 px-3 py-1.5 text-sm border-b" style={{ borderColor: 'var(--color-zinc-800)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>{t({ en: 'Edge', zh: '边' })}</span>
              <span>c(u,v)</span>
              <span>f(u,v)</span>
              <span style={{ color: '#34d399' }}>{t({ en: 'Fwd', zh: '正向' })}</span>
              <span style={{ color: '#c084fc' }}>{t({ en: 'Back', zh: '反向' })}</span>
              <span>{t({ en: 'Status', zh: '状态' })}</span>
            </div>

            {/* Rows */}
            {EDGE_STEPS.map((edge, i) => {
              const visible = i < visibleEdgeCount
              const isCurrentBatch = i >= visibleEdgeCount - 3 && i < visibleEdgeCount

              return (
                <AnimatePresence key={`${edge.from}-${edge.to}`}>
                  {visible && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: isCurrentBatch ? (i % 3) * 0.12 : 0 }}
                      className="grid grid-cols-6 gap-1 px-3 py-1.5 text-sm border-b"
                      style={{
                        borderColor: 'var(--color-zinc-900)',
                        fontFamily: 'var(--font-mono)',
                        background: isCurrentBatch ? 'rgba(52,211,153,0.05)' : 'transparent',
                      }}
                    >
                      <span style={{ color: 'var(--text-primary)' }}>{edge.from}{'\u2192'}{edge.to}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{edge.capacity}</span>
                      <span style={{ color: edge.flow > 0 ? '#34d399' : 'var(--text-muted)' }}>{edge.flow}</span>
                      <span style={{ color: edge.forwardResidual > 0 ? '#34d399' : 'var(--text-muted)' }}>
                        {edge.forwardResidual > 0 ? edge.forwardResidual : '-'}
                      </span>
                      <span style={{ color: edge.backResidual > 0 ? '#c084fc' : 'var(--text-muted)' }}>
                        {edge.backResidual > 0 ? edge.backResidual : '-'}
                      </span>
                      <span style={{ color: edge.flow === edge.capacity && edge.capacity > 0 ? '#f87171' : edge.flow > 0 ? '#fbbf24' : 'var(--text-muted)', fontSize: '13px' }}>
                        {edge.flow === edge.capacity && edge.capacity > 0
                          ? t({ en: 'saturated', zh: '饱和' })
                          : edge.flow > 0
                            ? t({ en: 'partial', zh: '部分' })
                            : t({ en: 'empty', zh: '空' })}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              )
            })}
          </div>
        </div>

        {/* Right: Progressive residual graph */}
        <div className="flex-1">
          <p className="text-sm mb-1 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {t({ en: 'Residual network Gf (building...)', zh: '残留网络 Gf（构建中...）' })}
          </p>
          <FlowNetworkGraph
            residualEdges={partialResidual}
            animateEntrance={false}
            delay={0}
          />
          <div className="flex gap-3 justify-center mt-2">
            <span className="flex items-center gap-1 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
              <span className="w-4 h-0.5 inline-block rounded" style={{ background: '#34d399' }} />
              <span style={{ color: '#34d399' }}>{t({ en: 'forward', zh: '正向' })}</span>
            </span>
            <span className="flex items-center gap-1 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
              <span className="w-4 h-0.5 inline-block rounded" style={{ background: '#c084fc', borderTop: '2px dashed #c084fc' }} />
              <span style={{ color: '#c084fc' }}>{t({ en: 'back', zh: '反向' })}</span>
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {subStep >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SlideBridge delay={0}>
              {t({
                en: 'Now we know how to build Gf. Next: how to use it!',
                zh: '现在我们知道如何构建 Gf 了。接下来：如何使用它！',
              })}
            </SlideBridge>
          </motion.div>
        )}
      </AnimatePresence>
    </SlideBase>
  )
}
