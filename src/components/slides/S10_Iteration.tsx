import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideContext } from '../ui/SlideBase'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { BFSWave } from '../graph/BFSWave'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import type { FordFulkersonIteration } from '../../types/graph'

interface IterationSlideProps {
  iteration: FordFulkersonIteration
  isLast?: boolean
}

export function IterationSlide({ iteration }: IterationSlideProps) {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)
  const { augmentingPath, flowBefore, flowAfter, residualEdges } = iteration

  // SubSteps:
  // 0: Show current flow state
  // 1: Show residual network
  // 2: BFS wave finds augmenting path
  // 3: Highlight path with bottleneck
  // 4: Update flow (show result)
  // 5: Show new flow with particles

  const showResidual = subStep >= 1 && subStep <= 3
  const showPath = subStep >= 3
  const showUpdatedFlow = subStep >= 4

  // Determine what to show on graph - single source of truth
  const graphLabel = showUpdatedFlow
    ? t({ en: `Updated flow: |f| = ${flowAfter.totalFlow}`, zh: `更新后流: |f| = ${flowAfter.totalFlow}` })
    : showResidual
      ? t({ en: 'Residual network Gf', zh: '残留网络 Gf' })
      : t({ en: `Current flow: |f| = ${flowBefore.totalFlow}`, zh: `当前流: |f| = ${flowBefore.totalFlow}` })

  const labelColor = showUpdatedFlow ? 'var(--accent)' : 'var(--text-muted)'

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 2: Ford-Fulkerson', zh: '第二部分：Ford-Fulkerson' })}</SlideContext>
      <SlideHeading>
        {t({ en: `Iteration ${iteration.iterationNumber}`, zh: `第 ${iteration.iterationNumber} 轮迭代` })}
      </SlideHeading>

      <div className="flex gap-4 mt-4 w-full max-w-6xl items-start">
        {/* Graph area */}
        <div className="flex-1">
          <p className="text-sm mb-1 text-center" style={{ color: labelColor, fontFamily: 'var(--font-mono)' }}>
            {graphLabel}
          </p>

          <FlowNetworkGraph
            flowEdges={showUpdatedFlow ? flowAfter.edges : (!showResidual ? flowBefore.edges : undefined)}
            residualEdges={showResidual ? residualEdges : undefined}
            highlightedPath={showPath ? augmentingPath.path : undefined}
            highlightColor="#34d399"
            showFlow={!showResidual}
            showParticles={showUpdatedFlow && subStep >= 5 ? true : (!showResidual && !showUpdatedFlow && flowBefore.totalFlow > 0)}
            animateEntrance={false}
            delay={0}
          >
            {subStep === 2 && (
              <BFSWave sourceId="s" discoveredNodes={augmentingPath.path} delay={0} />
            )}
          </FlowNetworkGraph>
        </div>

        {/* Status panel */}
        <div className="w-56 flex flex-col gap-3">
          {/* Step indicators */}
          {[
            { label: t({ en: 'Current flow', zh: '当前流' }), active: subStep === 0, done: subStep > 0, color: '#38bdf8' },
            { label: t({ en: 'Build Gf', zh: '构建 Gf' }), active: subStep === 1, done: subStep > 1, color: '#a78bfa' },
            { label: t({ en: 'BFS search', zh: 'BFS 搜索' }), active: subStep === 2, done: subStep > 2, color: '#22d3ee' },
            { label: t({ en: 'Find path', zh: '找到路径' }), active: subStep === 3, done: subStep > 3, color: '#34d399' },
            { label: t({ en: 'Update flow', zh: '更新流' }), active: subStep === 4, done: subStep > 4, color: '#fbbf24' },
            { label: t({ en: 'Result', zh: '结果' }), active: subStep === 5, done: false, color: '#f87171' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
              className="flex items-center gap-2"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                style={{
                  background: step.done ? `${step.color}30` : step.active ? `${step.color}20` : 'transparent',
                  border: `1.5px solid ${step.done || step.active ? step.color : 'var(--color-zinc-800)'}`,
                  color: step.done ? step.color : step.active ? step.color : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {step.done ? '\u2713' : i + 1}
              </div>
              <span
                className="text-sm"
                style={{
                  color: step.active ? step.color : step.done ? 'var(--text-secondary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {step.label}
              </span>
            </motion.div>
          ))}

          {/* Path info */}
          <AnimatePresence>
            {subStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {t({ en: 'Path:', zh: '路径：' })}
                </p>
                <p className="text-sm mt-1" style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  {augmentingPath.path.join(' \u2192 ')}
                </p>
                <p className="text-sm mt-1" style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  {t({ en: 'Bottleneck:', zh: '瓶颈：' })} {augmentingPath.bottleneck}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flow delta */}
          <AnimatePresence>
            {subStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 py-2 rounded-lg text-center"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}
              >
                <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  |f|: {flowBefore.totalFlow}
                </span>
                <span className="text-xs mx-2" style={{ color: '#34d399' }}>{'\u2192'}</span>
                <span className="text-sm font-medium" style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  {flowAfter.totalFlow}
                </span>
                <span className="text-xs ml-1" style={{ color: '#34d399' }}>
                  (+{augmentingPath.bottleneck})
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SlideBase>
  )
}
