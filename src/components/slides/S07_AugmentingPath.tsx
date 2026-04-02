import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideAccent, SlideContext } from '../ui/SlideBase'
import { FormulaCard } from '../ui/FormulaCard'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { BFSWave } from '../graph/BFSWave'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import { ITERATIONS } from '../../data/fordFulkersonSteps'

export function S07_AugmentingPath() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  // substep 0: definition + Gf graph
  // substep 1: BFS finds path, highlight it
  // substep 2: bottleneck calculation

  // Use post-iteration-1 residual (has back-edges!) to show BFS on a REAL Gf
  // This is the same Gf shown in the Residual Network slide (S05)
  const residual = ITERATIONS[1].residualEdges
  const path = ITERATIONS[1].augmentingPath

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 2: Augmenting Path', zh: '第二部分：增广路径' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Augmenting Path', zh: '增广路径' })}
      </SlideHeading>

      <div className="flex gap-8 mt-4 w-full max-w-6xl items-start">
        {/* Left: explanation */}
        <div className="w-80 flex flex-col gap-3 shrink-0">
          {/* Definition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 25 }}
            className="px-4 py-3 rounded-xl"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {t({ en: 'DEFINITION', zh: '定义' })}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {t({
                en: <>An <SlideAccent>augmenting path</SlideAccent> is a path from s to t in the <strong>residual network Gf</strong>, where every edge on the path has residual capacity {'>'} 0.</>,
                zh: <><SlideAccent>增广路径</SlideAccent>：在<strong>残留网络 Gf</strong> 中，从 s 到 t 的一条路径，路径上每条边的残留容量 {'>'} 0。</>,
              })}
            </p>
          </motion.div>

          {/* How to find: BFS on Gf */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
            className="px-4 py-3 rounded-xl"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)' }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {t({ en: 'HOW TO FIND?', zh: '怎么找？' })}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t({
                en: <>Just run <SlideAccent>BFS(s)</SlideAccent> on Gf, but only follow edges with cf {'>'} 0. When t is dequeued, trace parent pointers back to get the path.</>,
                zh: <>在 Gf 上跑 <SlideAccent>BFS(s)</SlideAccent>，但只走 cf {'>'} 0 的边。当 t 出队时，沿父节点指针回溯得到路径。</>,
              })}
            </p>
          </motion.div>

          {/* Key differences from regular BFS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
            className="px-4 py-3 rounded-xl"
            style={{ background: 'rgba(24,24,27,0.8)', border: '1px solid var(--color-zinc-800)' }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {t({ en: 'KEY POINTS', zh: '要点' })}
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t({
                  en: <><span style={{ color: '#34d399' }}>1.</span> Run on <strong>Gf</strong> (not original G) — includes back-edges</>,
                  zh: <><span style={{ color: '#34d399' }}>1.</span> 在 <strong>Gf</strong> 上跑（不是原图 G）— 包含反向边</>,
                })}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t({
                  en: <><span style={{ color: '#34d399' }}>2.</span> Only walk edges where cf(u,v) {'>'} 0</>,
                  zh: <><span style={{ color: '#34d399' }}>2.</span> 只走 cf(u,v) {'>'} 0 的边</>,
                })}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t({
                  en: <><span style={{ color: '#34d399' }}>3.</span> No revisiting! Use visited set — Gf has cycles (back-edges create u{'\u2192'}v{'\u2192'}u loops)</>,
                  zh: <><span style={{ color: '#34d399' }}>3.</span> 不能重复访问！用 visited 集合 — Gf 有环（反向边形成 u{'\u2192'}v{'\u2192'}u 循环）</>,
                })}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t({
                  en: <><span style={{ color: '#34d399' }}>4.</span> BFS finds the shortest path (fewest edges), O(VE{'\u00B2'})</>,
                  zh: <><span style={{ color: '#34d399' }}>4.</span> BFS 找最短路径（边数最少），复杂度 O(VE{'\u00B2'})</>,
                })}
              </p>
            </div>
          </motion.div>

          {/* Bottleneck */}
          <AnimatePresence>
            {subStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FormulaCard
                  latex={String.raw`c_f(p) = \min\{c_f(u,v) : (u,v) \in p\}`}
                  label={t({ en: 'Bottleneck capacity', zh: '瓶颈容量' })}
                  delay={0}
                />
                <p className="text-sm mt-1 pl-2" style={{ color: 'var(--text-muted)' }}>
                  {t({
                    en: 'Max flow we can push along this path',
                    zh: '沿这条路径最多能推送的流量',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: residual network graph */}
        <div className="flex-1">
          <p className="text-sm mb-1 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {subStep === 0
              ? t({ en: 'Residual network Gf after |f|=12 (has back-edges!)', zh: '|f|=12 后的残留网络 Gf（有反向边！）' })
              : subStep === 1
                ? t({ en: 'Running BFS from s on Gf...', zh: '在 Gf 上从 s 跑 BFS...' })
                : t({ en: 'Augmenting path found!', zh: '找到增广路径！' })
            }
          </p>
          <FlowNetworkGraph
            residualEdges={residual}
            highlightedPath={subStep >= 2 ? path.path : undefined}
            highlightColor="#34d399"
            animateEntrance={false}
            delay={0}
          >
            {subStep === 1 && (
              <BFSWave sourceId="s" discoveredNodes={['s', 'v1', 'v2', 'v3', 'v4', 't']} color="#22d3ee" delay={0} />
            )}
          </FlowNetworkGraph>

          {/* Path + bottleneck display */}
          <AnimatePresence>
            {subStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  {path.path.map((node, i) => (
                    <span key={node} className="flex items-center gap-1">
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.12, type: 'spring' }}
                        className="text-sm px-2 py-0.5 rounded"
                        style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
                      >
                        {node}
                      </motion.span>
                      {i < path.path.length - 1 && (
                        <span style={{ color: 'var(--text-muted)' }}>{'\u2192'}</span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    min({path.edgesOnPath.map(e => e.residualCapacity).join(', ')})
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>=</span>
                  <span className="px-2 py-0.5 rounded text-sm font-medium" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                    {t({ en: 'bottleneck:', zh: '瓶颈：' })} {path.bottleneck}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SlideBase>
  )
}
