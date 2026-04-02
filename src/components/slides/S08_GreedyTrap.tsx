import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'

export function S08_GreedyTrap() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  // substep 0: explain the role of back-edges conceptually
  // substep 1: show flow cancellation example
  // substep 2: why BFS + back-edges guarantees correctness
  // substep 3: connection to max-flow min-cut

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 2: Augmenting Path', zh: '第二部分：增广路径' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'The Role of Back-Edges', zh: '反向边的作用' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>Back-edges are the key to Ford-Fulkerson's <SlideAccent>correctness</SlideAccent>. They allow the algorithm to "undo" previous flow decisions.</>,
          zh: <>反向边是 Ford-Fulkerson <SlideAccent>正确性</SlideAccent>的关键。它允许算法"撤销"之前的流分配决策。</>,
        })}
      </SlideDescription>

      <div className="flex gap-8 mt-6 w-full max-w-6xl items-start">
        {/* Left: visual explanation */}
        <div className="flex-1">
          <svg viewBox="0 0 500 350" className="w-full">
            {/* Original edge with flow */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <text x={250} y={25} textAnchor="middle" fill="var(--text-muted)" fontSize={14} fontFamily="var(--font-mono)">
                {t({ en: 'Edge u\u2192v in original graph', zh: '原图中的边 u\u2192v' })}
              </text>

              {/* u node */}
              <circle cx={100} cy={80} r={25} fill="#38bdf815" stroke="#38bdf8" strokeWidth={2} />
              <text x={100} y={80} textAnchor="middle" dominantBaseline="central" fill="#38bdf8" fontSize={18} fontFamily="var(--font-mono)" fontWeight={600}>u</text>

              {/* v node */}
              <circle cx={400} cy={80} r={25} fill="#a1a1aa15" stroke="#a1a1aa" strokeWidth={2} />
              <text x={400} y={80} textAnchor="middle" dominantBaseline="central" fill="#a1a1aa" fontSize={18} fontFamily="var(--font-mono)" fontWeight={600}>v</text>

              {/* Forward arrow */}
              <line x1={130} y1={80} x2={370} y2={80} stroke="#71717a" strokeWidth={2} />
              <polygon points="370,80 360,74 360,86" fill="#71717a" />
              <text x={250} y={65} textAnchor="middle" fill="#a1a1aa" fontSize={15} fontFamily="var(--font-mono)">
                {t({ en: 'capacity 10, flow 6', zh: '容量 10，流 6' })}
              </text>
            </motion.g>

            {/* Arrow down */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <text x={250} y={130} textAnchor="middle" fill="var(--text-muted)" fontSize={22}>{'\u2193'}</text>
              <text x={250} y={155} textAnchor="middle" fill="var(--text-muted)" fontSize={13} fontFamily="var(--font-mono)">
                {t({ en: 'In residual network Gf:', zh: '在残留网络 Gf 中：' })}
              </text>
            </motion.g>

            {/* Residual forward edge */}
            <AnimatePresence>
              {subStep >= 0 && (
                <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  {/* u */}
                  <circle cx={100} cy={210} r={22} fill="#34d39915" stroke="#34d399" strokeWidth={2} />
                  <text x={100} y={210} textAnchor="middle" dominantBaseline="central" fill="#34d399" fontSize={16} fontFamily="var(--font-mono)">u</text>
                  {/* v */}
                  <circle cx={400} cy={210} r={22} fill="#34d39915" stroke="#34d399" strokeWidth={2} />
                  <text x={400} y={210} textAnchor="middle" dominantBaseline="central" fill="#34d399" fontSize={16} fontFamily="var(--font-mono)">v</text>
                  {/* Forward arrow */}
                  <line x1={125} y1={210} x2={373} y2={210} stroke="#34d399" strokeWidth={2} />
                  <polygon points="373,210 363,204 363,216" fill="#34d399" />
                  <text x={250} y={195} textAnchor="middle" fill="#34d399" fontSize={15} fontFamily="var(--font-mono)" fontWeight={500}>4</text>
                  <text x={250} y={232} textAnchor="middle" fill="var(--text-muted)" fontSize={13} fontFamily="var(--font-mono)">
                    {t({ en: 'forward: 10 - 6 = 4 remaining', zh: '正向：10 - 6 = 4 剩余' })}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* Residual back edge */}
            <AnimatePresence>
              {subStep >= 1 && (
                <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
                  {/* u */}
                  <circle cx={100} cy={300} r={22} fill="#c084fc15" stroke="#c084fc" strokeWidth={2} />
                  <text x={100} y={300} textAnchor="middle" dominantBaseline="central" fill="#c084fc" fontSize={16} fontFamily="var(--font-mono)">u</text>
                  {/* v */}
                  <circle cx={400} cy={300} r={22} fill="#c084fc15" stroke="#c084fc" strokeWidth={2} />
                  <text x={400} y={300} textAnchor="middle" dominantBaseline="central" fill="#c084fc" fontSize={16} fontFamily="var(--font-mono)">v</text>
                  {/* Back arrow (v to u) */}
                  <line x1={375} y1={300} x2={127} y2={300} stroke="#c084fc" strokeWidth={2.5} strokeDasharray="8 5" />
                  <polygon points="127,300 137,294 137,306" fill="#c084fc" />
                  <text x={250} y={285} textAnchor="middle" fill="#c084fc" fontSize={15} fontFamily="var(--font-mono)" fontWeight={500}>6</text>
                  <text x={250} y={322} textAnchor="middle" fill="var(--text-muted)" fontSize={13} fontFamily="var(--font-mono)">
                    {t({ en: 'back: flow 6 can be "undone"', zh: '反向：流 6 可被"撤销"' })}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        {/* Right: explanation cards */}
        <div className="w-96 flex flex-col gap-3 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="px-5 py-4 rounded-xl"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}
          >
            <p className="text-base font-medium" style={{ color: '#34d399' }}>
              {t({ en: 'Forward edge: push more', zh: '正向边：继续推送' })}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t({
                en: 'Capacity remaining = c(u,v) - f(u,v). We can send more flow from u to v.',
                zh: '剩余容量 = c(u,v) - f(u,v)。还能从 u 往 v 推更多流。',
              })}
            </p>
          </motion.div>

          <AnimatePresence>
            {subStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="px-5 py-4 rounded-xl"
                style={{ background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.25)' }}
              >
                <p className="text-base font-medium" style={{ color: '#c084fc' }}>
                  {t({ en: 'Back edge: undo (cancel) flow', zh: '反向边：撤销(undo)流' })}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'Capacity = f(u,v). Pushing flow on v\u2192u effectively cancels flow on u\u2192v. This lets the algorithm correct mistakes.',
                    zh: '容量 = f(u,v)。沿 v\u2192u 推流 = 实际上取消 u\u2192v 上的流。让算法能纠正错误的分配。',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {subStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="px-5 py-4 rounded-xl"
                style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)' }}
              >
                <p className="text-base font-medium" style={{ color: '#38bdf8' }}>
                  {t({ en: 'Why essential?', zh: '为什么必不可少？' })}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'Without back-edges, the algorithm might get stuck at a sub-optimal flow. Back-edges guarantee: if more flow is possible, BFS will find an augmenting path to achieve it.',
                    zh: '没有反向边，算法可能卡在次优流上。有了反向边才能保证：如果还能增加流量，BFS 一定能找到增广路径来实现。',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {subStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="px-5 py-4 rounded-xl"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}
              >
                <p className="text-base font-medium" style={{ color: '#fbbf24' }}>
                  {t({ en: 'The guarantee', zh: '保证' })}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'Ford-Fulkerson terminates when BFS finds no augmenting path in Gf. At that point, the flow is maximum. This is proven by the Max-Flow Min-Cut Theorem (coming up!).',
                    zh: 'Ford-Fulkerson 在 BFS 找不到增广路径时终止。此时流量是最大的。这由最大流最小割定理证明（后面讲！）。',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SlideBase>
  )
}
