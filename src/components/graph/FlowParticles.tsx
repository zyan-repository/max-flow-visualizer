import { motion } from 'framer-motion'
import { getNode } from '../../data/exampleGraph'

interface FlowParticlesProps {
  from: string
  to: string
  flow: number
  maxCapacity: number
  color?: string
  isBackEdge?: boolean
}

export function FlowParticles({
  from,
  to,
  flow,
  maxCapacity,
  color = '#34d399',
  isBackEdge = false,
}: FlowParticlesProps) {
  if (flow <= 0) return null

  const fromNode = getNode(from)
  const toNode = getNode(to)

  const dx = toNode.x - fromNode.x
  const dy = toNode.y - fromNode.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / dist
  const ny = dy / dist

  const fromRadius = fromNode.type === 'source' || fromNode.type === 'sink' ? 24 : 20
  const toRadius = toNode.type === 'source' || toNode.type === 'sink' ? 24 : 20

  const startX = fromNode.x + nx * (fromRadius + 6)
  const startY = fromNode.y + ny * (fromRadius + 6)
  const endX = toNode.x - nx * (toRadius + 10)
  const endY = toNode.y - ny * (toRadius + 10)

  // Number of particles proportional to flow
  const numParticles = Math.max(2, Math.min(6, Math.ceil((flow / maxCapacity) * 6)))
  const duration = 1.5 + (1 - flow / maxCapacity) * 1

  const offset = isBackEdge ? 18 : 0
  const perpX = -ny * offset
  const perpY = nx * offset

  return (
    <g>
      {Array.from({ length: numParticles }, (_, i) => {
        const stagger = (i / numParticles) * duration

        return (
          <motion.circle
            key={i}
            r={2.5}
            fill={color}
            filter="url(#particleGlow)"
            initial={{ opacity: 0 }}
            animate={{
              cx: offset === 0
                ? [startX, endX]
                : [startX, (startX + endX) / 2 + perpX, endX],
              cy: offset === 0
                ? [startY, endY]
                : [startY, (startY + endY) / 2 + perpY, endY],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: stagger,
              ease: 'linear',
            }}
          />
        )
      })}
    </g>
  )
}
