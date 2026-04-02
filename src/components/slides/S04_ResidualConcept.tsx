import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { FormulaCard } from '../ui/FormulaCard'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'

export function S04_ResidualConcept() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 1: Residual Network', zh: '第一部分：残留网络' })}</SlideContext>
      <SlideHeading>
        {t({ en: "What's Left? Residual Capacity", zh: '还剩多少？残留容量' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>Given a flow f, the <SlideAccent>residual capacity</SlideAccent> tells us how much more flow we can push — or reverse.</>,
          zh: <>给定流 f，<SlideAccent>残留容量</SlideAccent>告诉我们还能推送多少流——或者回退多少。</>,
        })}
      </SlideDescription>

      {/* Visual edge demonstration */}
      <motion.div
        className="mt-8 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <svg viewBox="0 0 720 240" className="w-full">
          <defs>
            <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Original edge: u -> v with c=10, f=6 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {/* Nodes */}
            <circle cx={80} cy={60} r={22} fill="#38bdf815" stroke="#38bdf8" strokeWidth={2} />
            <text x={80} y={60} textAnchor="middle" dominantBaseline="central" fill="#38bdf8" fontSize={16} fontFamily="var(--font-mono)">u</text>
            <circle cx={340} cy={60} r={22} fill="#a1a1aa15" stroke="#a1a1aa" strokeWidth={2} />
            <text x={340} y={60} textAnchor="middle" dominantBaseline="central" fill="#a1a1aa" fontSize={16} fontFamily="var(--font-mono)">v</text>

            {/* Edge */}
            <motion.line x1={105} y1={60} x2={315} y2={60} stroke="#71717a" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
            <polygon points="315,60 305,54 305,66" fill="#71717a" />

            {/* Label */}
            <text x={210} y={45} textAnchor="middle" fill="#a1a1aa" fontSize={13} fontFamily="var(--font-mono)">6 / 10</text>
            <text x={210} y={80} textAnchor="middle" fill="var(--text-muted)" fontSize={13} fontFamily="var(--font-sans)">
              {t({ en: 'Original edge', zh: '原始边' })}
            </text>
          </motion.g>

          {/* Arrow indicating transformation */}
          <AnimatePresence>
            {subStep >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}>
                <text x={420} y={60} textAnchor="middle" dominantBaseline="central" fill="var(--text-muted)" fontSize={24}>
                  {'\u2192'}
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Forward residual edge */}
          <AnimatePresence>
            {subStep >= 1 && (
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
                <circle cx={460} cy={40} r={16} fill="#34d39915" stroke="#34d399" strokeWidth={1.5} />
                <text x={460} y={40} textAnchor="middle" dominantBaseline="central" fill="#34d399" fontSize={13} fontFamily="var(--font-mono)">u</text>
                <circle cx={580} cy={40} r={16} fill="#34d39915" stroke="#34d399" strokeWidth={1.5} />
                <text x={580} y={40} textAnchor="middle" dominantBaseline="central" fill="#34d399" fontSize={13} fontFamily="var(--font-mono)">v</text>

                <motion.line x1={478} y1={40} x2={562} y2={40} stroke="#34d399" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                <polygon points="562,40 554,35 554,45" fill="#34d399" />
                <text x={520} y={28} textAnchor="middle" fill="#34d399" fontSize={12} fontFamily="var(--font-mono)">4</text>
                <text x={520} y={58} textAnchor="middle" fill="var(--text-muted)" fontSize={13}>c - f = 10 - 6</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Back residual edge */}
          <AnimatePresence>
            {subStep >= 2 && (
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
                <circle cx={460} cy={100} r={16} fill="#a78bfa15" stroke="#a78bfa" strokeWidth={1.5} />
                <text x={460} y={100} textAnchor="middle" dominantBaseline="central" fill="#a78bfa" fontSize={13} fontFamily="var(--font-mono)">u</text>
                <circle cx={580} cy={100} r={16} fill="#a78bfa15" stroke="#a78bfa" strokeWidth={1.5} />
                <text x={580} y={100} textAnchor="middle" dominantBaseline="central" fill="#a78bfa" fontSize={13} fontFamily="var(--font-mono)">v</text>

                <motion.line x1={562} y1={100} x2={478} y2={100} stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                <polygon points="478,100 486,95 486,105" fill="#a78bfa" />
                <text x={520} y={88} textAnchor="middle" fill="#a78bfa" fontSize={12} fontFamily="var(--font-mono)">6</text>
                <text x={520} y={118} textAnchor="middle" fill="var(--text-muted)" fontSize={13}>f = 6</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Labels legend */}
          <AnimatePresence>
            {subStep >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 }}>
                <rect x={440} y={130} width={270} height={70} rx={8} fill="rgba(24,24,27,0.8)" stroke="var(--color-zinc-800)" strokeWidth={1} />
                <circle cx={460} cy={148} r={4} fill="#34d399" />
                <text x={470} y={148} dominantBaseline="central" fill="#34d399" fontSize={13} fontFamily="var(--font-mono)">
                  {t({ en: 'Forward: can push more flow', zh: '正向边：还能继续推送流' })}
                </text>
                <circle cx={460} cy={172} r={4} fill="#c084fc" />
                <text x={470} y={172} dominantBaseline="central" fill="#c084fc" fontSize={13} fontFamily="var(--font-mono)">
                  {t({ en: 'Back: can undo (cancel) flow', zh: '反向边：可撤销(undo)已有流' })}
                </text>
                <text x={470} y={190} dominantBaseline="central" fill="var(--text-muted)" fontSize={12} fontFamily="var(--font-mono)">
                  {t({ en: 'capacity = existing flow amount', zh: '容量 = 已推送的流量' })}
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* Formula */}
      <AnimatePresence>
        {subStep >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <FormulaCard
              latex={String.raw`c_f(u,v) = \begin{cases} c(u,v) - f(u,v) & \text{if } (u,v) \in E \\ f(v,u) & \text{if } (v,u) \in E \\ 0 & \text{otherwise} \end{cases}`}
              label={t({ en: 'Residual Capacity', zh: '残留容量' })}
              delay={0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SlideBase>
  )
}
