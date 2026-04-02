import { motion } from 'framer-motion'
import { SlideBase } from '../ui/SlideBase'
import { useT } from '../../hooks/useT'
import { NODES, EDGES } from '../../data/exampleGraph'
import { getNode } from '../../data/exampleGraph'
import { useMemo } from 'react'

// Seeded random for consistent particles
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

export function S00_Title() {
  const t = useT()

  const particles = useMemo(() => {
    const rng = seededRandom(42)
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: 1.5 + rng() * 2.5,
      duration: 6 + rng() * 8,
      delay: rng() * 4,
      opacity: 0.1 + rng() * 0.3,
    }))
  }, [])

  return (
    <SlideBase className="relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              background: '#34d399',
            }}
            animate={{
              top: ['110%', '-10%'],
              opacity: [0, p.opacity, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Subtle graph silhouette */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <svg viewBox="0 0 640 400" className="w-full max-w-3xl" style={{ maxHeight: '50vh' }}>
          {EDGES.map((edge, i) => {
            const from = getNode(edge.from)
            const to = getNode(edge.to)
            return (
              <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#34d399" strokeWidth={2} />
            )
          })}
          {NODES.map(node => (
            <circle key={node.id} cx={node.x} cy={node.y} r={16} fill="none" stroke="#34d399" strokeWidth={2} />
          ))}
        </svg>
      </motion.div>

      {/* Glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Title */}
      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm tracking-widest uppercase mb-6"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          {t({ en: 'Chapter 26 — Network Flow', zh: '第26章 — 网络流' })}
        </motion.p>

        <motion.h1
          className="text-7xl font-medium tracking-tight mb-4"
          style={{ letterSpacing: '-0.03em' }}
        >
          {'Maximum Flow'.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
                delay: 0.4 + i * 0.04,
              }}
              style={{ display: 'inline-block', color: char === ' ' ? undefined : undefined }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 1.2 }}
          className="text-3xl font-light mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t({ en: 'Ford-Fulkerson Algorithm', zh: 'Ford-Fulkerson 算法' })}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex gap-8 justify-center mt-12"
        >
          {[
            { label: t({ en: 'Residual Network', zh: '残留网络' }), color: '#38bdf8' },
            { label: t({ en: 'Augmenting Path', zh: '增广路径' }), color: '#34d399' },
            { label: t({ en: 'Cut & Theorem', zh: '割与定理' }), color: '#fbbf24' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + i * 0.15, type: 'spring', stiffness: 200, damping: 25 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}60` }} />
              <span className="text-sm" style={{ color: item.color, fontFamily: 'var(--font-mono)' }}>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideBase>
  )
}
