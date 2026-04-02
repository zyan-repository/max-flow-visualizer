import { motion } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideBridge } from '../ui/SlideBase'
import { useT } from '../../hooks/useT'

const PIPE_SEGMENTS = [
  { from: { x: 60, y: 180 }, to: { x: 180, y: 100 }, capacity: 16, label: '16' },
  { from: { x: 60, y: 180 }, to: { x: 180, y: 260 }, capacity: 13, label: '13' },
  { from: { x: 180, y: 100 }, to: { x: 360, y: 100 }, capacity: 12, label: '12' },
  { from: { x: 180, y: 260 }, to: { x: 360, y: 260 }, capacity: 14, label: '14' },
  { from: { x: 360, y: 100 }, to: { x: 480, y: 180 }, capacity: 20, label: '20' },
  { from: { x: 360, y: 260 }, to: { x: 480, y: 180 }, capacity: 4, label: '4' },
]

function WaterParticle({ from, to, delay, duration }: { from: { x: number; y: number }; to: { x: number; y: number }; delay: number; duration: number }) {
  return (
    <motion.circle
      r={3}
      fill="#38bdf8"
      filter="url(#waterGlow)"
      animate={{
        cx: [from.x, to.x],
        cy: [from.y, to.y],
        opacity: [0, 0.8, 0.8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export function S01_ProblemIntro() {
  const t = useT()

  return (
    <SlideBase>
      <SlideHeading>
        {t({ en: 'The Pipeline Problem', zh: '管道问题' })}
      </SlideHeading>
      <SlideDescription>
        {t({
          en: <>Imagine a network of <SlideAccent>oil pipelines</SlideAccent> connecting a source to a destination. Each pipe has a maximum capacity. How much oil can we transport from source to sink?</>,
          zh: <>想象一个由<SlideAccent>输油管道</SlideAccent>组成的网络，连接着起点和终点。每条管道有最大容量限制。我们最多能从源点输送多少油到汇点？</>,
        })}
      </SlideDescription>

      {/* Animated pipe network */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.4 }}
        className="mt-8 w-full max-w-3xl"
      >
        <svg viewBox="0 0 540 360" className="w-full">
          <defs>
            <filter id="waterGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="pipeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="50%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#3f3f46" />
            </linearGradient>
          </defs>

          {/* Pipes */}
          {PIPE_SEGMENTS.map((seg, i) => (
            <motion.g key={i}>
              <motion.line
                x1={seg.from.x} y1={seg.from.y}
                x2={seg.to.x} y2={seg.to.y}
                stroke="#3f3f46"
                strokeWidth={Math.max(6, seg.capacity * 0.6)}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              />
              {/* Capacity label */}
              <motion.text
                x={(seg.from.x + seg.to.x) / 2}
                y={(seg.from.y + seg.to.y) / 2 - 12}
                textAnchor="middle"
                fill="var(--color-zinc-500)"
                fontSize={13}
                fontFamily="var(--font-mono)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                {seg.label}
              </motion.text>
            </motion.g>
          ))}

          {/* Water particles */}
          {PIPE_SEGMENTS.map((seg, i) =>
            Array.from({ length: 3 }, (_, j) => (
              <WaterParticle
                key={`${i}-${j}`}
                from={seg.from}
                to={seg.to}
                delay={1.5 + i * 0.2 + j * 0.6}
                duration={1.2}
              />
            ))
          )}

          {/* Source node */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
          >
            <circle cx={60} cy={180} r={22} fill="#38bdf815" stroke="#38bdf8" strokeWidth={2} />
            <text x={60} y={180} textAnchor="middle" dominantBaseline="central" fill="#38bdf8" fontSize={16} fontFamily="var(--font-mono)" fontWeight={600}>s</text>
          </motion.g>

          {/* Sink node */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
          >
            <circle cx={480} cy={180} r={22} fill="#f8717115" stroke="#f87171" strokeWidth={2} />
            <text x={480} y={180} textAnchor="middle" dominantBaseline="central" fill="#f87171" fontSize={16} fontFamily="var(--font-mono)" fontWeight={600}>t</text>
          </motion.g>

          {/* Intermediate nodes */}
          {[{ x: 180, y: 100 }, { x: 180, y: 260 }, { x: 360, y: 100 }, { x: 360, y: 260 }].map((pos, i) => (
            <motion.circle
              key={i}
              cx={pos.x} cy={pos.y} r={8}
              fill="#27272a" stroke="#71717a" strokeWidth={1.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </svg>
      </motion.div>

      <SlideBridge delay={1.8}>
        {t({ en: 'This is the Maximum Flow problem', zh: '这就是最大流问题' })}
      </SlideBridge>
    </SlideBase>
  )
}
