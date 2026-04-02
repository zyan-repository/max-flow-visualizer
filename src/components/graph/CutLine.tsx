import { motion } from 'framer-motion'
import { getNode } from '../../data/exampleGraph'
import type { CutDefinition } from '../../types/graph'

interface CutLineProps {
  cut: CutDefinition
  delay?: number
  color?: string
}

export function CutLine({ cut, delay = 0, color = '#fbbf24' }: CutLineProps) {
  // Calculate the dividing line between S and T sets
  // Find the average x position of the boundary
  const sNodes = cut.S.map(id => getNode(id))
  const tNodes = cut.T.map(id => getNode(id))

  const maxSx = Math.max(...sNodes.map(n => n.x))
  const minTx = Math.min(...tNodes.map(n => n.x))
  const cutX = (maxSx + minTx) / 2

  // Calculate y extent with padding
  const allNodes = [...sNodes, ...tNodes]
  const minY = Math.min(...allNodes.map(n => n.y)) - 50
  const maxY = Math.max(...allNodes.map(n => n.y)) + 50

  return (
    <g>
      {/* Cut line with glow */}
      <motion.line
        x1={cutX}
        y1={minY}
        x2={cutX}
        y2={maxY}
        stroke={color}
        strokeWidth={3}
        strokeDasharray="8 4"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay }}
      />

      {/* S label */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.5, duration: 0.3 }}
      >
        <rect x={cutX - 50} y={minY - 5} width={30} height={22} rx={4} fill={`${color}20`} stroke={color} strokeWidth={1} />
        <text x={cutX - 35} y={minY + 6} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={13} fontFamily="var(--font-mono)" fontWeight={600}>
          S
        </text>
      </motion.g>

      {/* T label */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.5, duration: 0.3 }}
      >
        <rect x={cutX + 20} y={minY - 5} width={30} height={22} rx={4} fill={`${color}20`} stroke={color} strokeWidth={1} />
        <text x={cutX + 35} y={minY + 6} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={13} fontFamily="var(--font-mono)" fontWeight={600}>
          T
        </text>
      </motion.g>

      {/* Sparks at cut edge intersections */}
      {cut.cutEdges.map((edge, i) => {
        const fromNode = getNode(edge.from)
        const toNode = getNode(edge.to)
        const t = (cutX - fromNode.x) / (toNode.x - fromNode.x)
        const sparkY = fromNode.y + t * (toNode.y - fromNode.y)

        return (
          <motion.g key={i}>
            <motion.circle
              cx={cutX}
              cy={sparkY}
              r={5}
              fill={color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 0.6, delay: delay + 0.3 + i * 0.15, repeat: 2 }}
            />
            {/* Capacity label on cut edge */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.8 }}
            >
              <text
                x={cutX + 8}
                y={sparkY + 4}
                fill={color}
                fontSize={13}
                fontFamily="var(--font-mono)"
                fontWeight={500}
              >
                {edge.capacity}
              </text>
            </motion.g>
          </motion.g>
        )
      })}
    </g>
  )
}
