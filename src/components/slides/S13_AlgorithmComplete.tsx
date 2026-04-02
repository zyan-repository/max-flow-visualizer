import { motion } from 'framer-motion'
import { SlideBase, SlideHeading, SlideContext, SlideBridge } from '../ui/SlideBase'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { useT } from '../../hooks/useT'
import { FINAL_FLOW_STATE, MAX_FLOW_VALUE } from '../../data/fordFulkersonSteps'
import { useState, useEffect } from 'react'

export function S13_AlgorithmComplete() {
  const t = useT()
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const target = MAX_FLOW_VALUE
    const duration = 1500
    const steps = 30
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCounter(Math.round(eased * target))
      if (step >= steps) {
        clearInterval(timer)
        setCounter(target)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <SlideBase className="relative">
      {/* Celebration glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.12) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <SlideContext>{t({ en: 'Part 2: Ford-Fulkerson', zh: '第二部分：Ford-Fulkerson' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Max Flow Reached!', zh: '最大流已达成!' })}
      </SlideHeading>

      {/* Animated counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
        className="text-center my-4"
      >
        <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>|f| = </span>
        <span
          className="text-6xl font-bold tabular-nums"
          style={{
            color: '#34d399',
            fontFamily: 'var(--font-mono)',
            textShadow: '0 0 40px rgba(52,211,153,0.4)',
          }}
        >
          {counter}
        </span>
      </motion.div>

      {/* Final flow graph with all particles */}
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring' }}
      >
        <FlowNetworkGraph
          flowEdges={FINAL_FLOW_STATE.edges}
          showFlow
          showParticles
          delay={0.8}
        />
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-4 flex gap-6 text-sm"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>
          {t({ en: '3 iterations', zh: '3 轮迭代' })}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          {t({ en: 'Paths: 12 + 4 + 7 = 23', zh: '路径: 12 + 4 + 7 = 23' })}
        </span>
      </motion.div>

      <SlideBridge delay={2}>
        {t({ en: "But why is 23 the maximum? Enter: the Cut.", zh: '但为什么 23 就是最大值？接下来：割。' })}
      </SlideBridge>
    </SlideBase>
  )
}
