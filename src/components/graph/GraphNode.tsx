import { motion } from 'framer-motion'
import type { GraphNode as GraphNodeType } from '../../types/graph'

interface GraphNodeProps {
  node: GraphNodeType
  active?: boolean
  highlighted?: boolean
  highlightColor?: string
  delay?: number
  showLabel?: boolean
  cutSide?: 'S' | 'T' | null
}

const TYPE_COLORS = {
  source: '#38bdf8',
  sink: '#f87171',
  normal: '#a1a1aa',
}

export function GraphNodeComponent({
  node,
  active = false,
  highlighted = false,
  highlightColor = '#34d399',
  delay = 0,
  showLabel = true,
  cutSide = null,
}: GraphNodeProps) {
  const baseColor = cutSide === 'S' ? '#38bdf8' : cutSide === 'T' ? '#fbbf24' : TYPE_COLORS[node.type]
  const color = highlighted ? highlightColor : baseColor
  const radius = node.type === 'source' || node.type === 'sink' ? 24 : 20

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay }}
    >
      {/* Glow effect */}
      {(active || highlighted) && (
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={radius + 8}
          fill="none"
          stroke={color}
          strokeWidth={2}
          initial={{ opacity: 0, r: radius }}
          animate={{ opacity: [0, 0.6, 0], r: radius + 12 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Node circle */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={radius}
        fill={`${color}15`}
        stroke={color}
        strokeWidth={2}
        animate={{
          filter: active || highlighted ? `drop-shadow(0 0 8px ${color}80)` : 'none',
        }}
      />

      {/* Label */}
      {showLabel && (
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize={node.type === 'source' || node.type === 'sink' ? 18 : 16}
          fontFamily="var(--font-mono)"
          fontWeight={500}
        >
          {node.label}
        </text>
      )}
    </motion.g>
  )
}
