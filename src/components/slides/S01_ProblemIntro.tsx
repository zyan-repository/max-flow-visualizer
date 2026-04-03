import { motion } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideBridge } from '../ui/SlideBase'
import { useT } from '../../hooks/useT'

// Farm drainage: 4 junctions, 5 ditches. Answer = 50
// Original P2740: 1→2(40), 1→4(20), 2→4(20), 2→3(30), 3→4(10)
// Layout: all nodes in a line, long-range edges curve above/below
const NODE_R = { pond: 24, mid: 14, creek: 24 } as const

const JUNCTIONS = [
  { id: 1, x: 60,  y: 165, role: 'pond' as const },
  { id: 2, x: 210, y: 165, role: 'mid' as const },
  { id: 3, x: 360, y: 165, role: 'mid' as const },
  { id: 4, x: 490, y: 165, role: 'creek' as const },
]

type Ditch = {
  from: number; to: number; cap: number
  labelSide: number
  curve?: { cx: number; cy: number }
}

const DITCHES: readonly Ditch[] = [
  { from: 1, to: 2, cap: 40, labelSide: -1 },
  { from: 2, to: 3, cap: 30, labelSide: -1 },
  { from: 3, to: 4, cap: 10, labelSide: -1 },
  { from: 2, to: 4, cap: 20, labelSide: -1, curve: { cx: 350, cy: 55 } },
  { from: 1, to: 4, cap: 20, labelSide: 1, curve: { cx: 275, cy: 290 } },
]

function getJ(id: number) {
  return JUNCTIONS.find(j => j.id === id)!
}

function getR(id: number) {
  return NODE_R[getJ(id).role]
}

// Shorten a straight line so it stops at node borders
function shortenLine(from: { x: number; y: number }, to: { x: number; y: number }, rFrom: number, rTo: number) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len
  const uy = dy / len
  return {
    x1: from.x + ux * rFrom,
    y1: from.y + uy * rFrom,
    x2: to.x - ux * (rTo + 4), // +4 for arrow tip space
    y2: to.y - uy * (rTo + 4),
  }
}

// Shorten a quadratic bezier endpoint by pulling it back along the tangent at t=1
function shortenCurveEnd(from: { x: number; y: number }, ctrl: { cx: number; cy: number }, to: { x: number; y: number }, rFrom: number, rTo: number) {
  // Tangent at t=0: 2*(ctrl - from)
  const t0dx = ctrl.cx - from.x
  const t0dy = ctrl.cy - from.y
  const t0len = Math.sqrt(t0dx * t0dx + t0dy * t0dy)
  const sx = from.x + (t0dx / t0len) * rFrom
  const sy = from.y + (t0dy / t0len) * rFrom

  // Tangent at t=1: 2*(to - ctrl)
  const t1dx = to.x - ctrl.cx
  const t1dy = to.y - ctrl.cy
  const t1len = Math.sqrt(t1dx * t1dx + t1dy * t1dy)
  const offset = rTo + 4
  const ex = to.x - (t1dx / t1len) * offset
  const ey = to.y - (t1dy / t1len) * offset

  return { sx, sy, ex, ey }
}

function WaterDrop({ from, to, delay, duration, curvePath }: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  delay: number
  duration: number
  curvePath?: string
}) {
  if (curvePath) {
    return (
      <circle r={3} fill="#38bdf8" filter="url(#dropGlow)" opacity={0}>
        <animateMotion
          path={curvePath}
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.8;0.8;0"
          keyTimes="0;0.1;0.9;1"
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </circle>
    )
  }
  return (
    <motion.circle
      r={3} fill="#38bdf8" filter="url(#dropGlow)"
      animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 0.8, 0.8, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export function S01_ProblemIntro() {
  const t = useT()

  return (
    <SlideBase>
      <SlideHeading>
        {t({ en: 'A Real-World Problem', zh: '一个现实问题' })}
      </SlideHeading>

      <SlideDescription>
        {t({
          en: <>A farm always floods when it rains. The farmer dug <SlideAccent>drainage ditches</SlideAccent> to route water from a pond to a nearby creek. Each ditch has a maximum flow capacity. What is the <SlideAccent>maximum amount of water</SlideAccent> that can be drained from the pond to the creek per second?</>,
          zh: <>一个农场每逢下雨就会被淹。农场主挖了若干<SlideAccent>排水沟</SlideAccent>，将积水从水潭引流到附近的小溪。每条沟有最大流量限制。那么每秒最多能从水潭排出<SlideAccent>多少水</SlideAccent>到小溪？</>,
        })}
      </SlideDescription>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.4 }}
        className="mt-8 w-full max-w-3xl"
      >
        <svg viewBox="0 0 550 340" className="w-full">
          <defs>
            <filter id="dropGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrowDitch" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
              <path d="M0,0.5 L4.5,2 L0,3.5" fill="none" stroke="#a1a1aa" strokeWidth={0.8} />
            </marker>
          </defs>

          {/* Edges */}
          {DITCHES.map((d, i) => {
            const f = getJ(d.from)
            const tgt = getJ(d.to)
            const rFrom = getR(d.from)
            const rTo = getR(d.to)

            if (d.curve) {
              const { cx, cy } = d.curve
              // Shorten start/end along tangent so edge stops at node border
              const { sx, sy, ex, ey } = shortenCurveEnd(f, d.curve, tgt, rFrom, rTo)
              const midX = 0.25 * f.x + 0.5 * cx + 0.25 * tgt.x
              const midY = 0.25 * f.y + 0.5 * cy + 0.25 * tgt.y
              const labelOff = 16 * d.labelSide
              return (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                >
                  <path
                    d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`}
                    stroke="#52525b"
                    strokeWidth={2}
                    strokeLinecap="round"
                    fill="none"
                    markerEnd="url(#arrowDitch)"
                  />
                  <text
                    x={midX} y={midY + labelOff}
                    textAnchor="middle" dominantBaseline="central"
                    fill="#71717a" fontSize={13} fontFamily="var(--font-mono)"
                  >
                    {d.cap}
                  </text>
                </motion.g>
              )
            }

            // Straight edge — shortened to node borders
            const { x1, y1, x2, y2 } = shortenLine(f, tgt, rFrom, rTo)
            const mx = (f.x + tgt.x) / 2
            const my = (f.y + tgt.y) / 2
            const labelOff = 16 * d.labelSide
            return (
              <motion.g key={i}>
                <motion.line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#52525b"
                  strokeWidth={2}
                  strokeLinecap="round"
                  markerEnd="url(#arrowDitch)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
                />
                <motion.text
                  x={mx} y={my + labelOff}
                  textAnchor="middle" dominantBaseline="central"
                  fill="var(--color-zinc-500)" fontSize={13} fontFamily="var(--font-mono)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  {d.cap}
                </motion.text>
              </motion.g>
            )
          })}

          {/* Water drops — must follow the same path as the visible edges */}
          {DITCHES.map((d, i) => {
            const f = getJ(d.from)
            const tgt = getJ(d.to)
            // For curved edges, build the same shortened path used by the visible <path>
            let curvePath: string | undefined
            if (d.curve) {
              const { cx, cy } = d.curve
              const { sx, sy, ex, ey } = shortenCurveEnd(f, d.curve, tgt, getR(d.from), getR(d.to))
              // animateMotion path is relative to the element's position (0,0),
              // so we use absolute coords directly
              curvePath = `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`
            }
            return Array.from({ length: 3 }, (_, j) => (
              <WaterDrop
                key={`${i}-${j}`}
                from={f} to={tgt}
                delay={1.5 + i * 0.25 + j * 0.5}
                duration={d.curve ? 1.8 : 1.2}
                curvePath={curvePath}
              />
            ))
          })}

          {/* Pond (source) */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <circle cx={60} cy={165} r={24} fill="#38bdf815" stroke="#38bdf8" strokeWidth={2} />
            <text x={60} y={155} textAnchor="middle" dominantBaseline="central" fill="#38bdf8" fontSize={14} fontFamily="var(--font-mono)" fontWeight={600}>
              {t({ en: 'Pond', zh: '水潭' })}
            </text>
            <text x={60} y={177} textAnchor="middle" dominantBaseline="central" fill="#38bdf860" fontSize={11} fontFamily="var(--font-mono)">s</text>
          </motion.g>

          {/* Creek (sink) */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
          >
            <circle cx={490} cy={165} r={24} fill="#f8717115" stroke="#f87171" strokeWidth={2} />
            <text x={490} y={155} textAnchor="middle" dominantBaseline="central" fill="#f87171" fontSize={14} fontFamily="var(--font-mono)" fontWeight={600}>
              {t({ en: 'Creek', zh: '小溪' })}
            </text>
            <text x={490} y={177} textAnchor="middle" dominantBaseline="central" fill="#f8717160" fontSize={11} fontFamily="var(--font-mono)">t</text>
          </motion.g>

          {/* Intermediate junctions (2 and 3) */}
          {[getJ(2), getJ(3)].map((j, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.35 + i * 0.1 }}
            >
              <circle cx={j.x} cy={j.y} r={14} fill="#27272a" stroke="#71717a" strokeWidth={1.5} />
              <text x={j.x} y={j.y} textAnchor="middle" dominantBaseline="central" fill="#a1a1aa" fontSize={13} fontFamily="var(--font-mono)" fontWeight={500}>
                {JUNCTIONS[i + 1].id}
              </text>
            </motion.g>
          ))}

          {/* Question */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0.6 }}>
            <text x={275} y={330} textAnchor="middle" fill="var(--text-muted)" fontSize={13} fontFamily="var(--font-mono)">
              {t({ en: 'Max drainage rate = ?', zh: '最大排水量 = ?' })}
            </text>
          </motion.g>
        </svg>
      </motion.div>

      <SlideBridge delay={2.8}>
        {t({ en: 'This is the Maximum Flow problem', zh: '这就是最大流问题' })}
      </SlideBridge>
    </SlideBase>
  )
}
