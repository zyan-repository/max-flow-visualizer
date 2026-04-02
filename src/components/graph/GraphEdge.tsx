import { motion } from 'framer-motion'
import { getNode } from '../../data/exampleGraph'

interface GraphEdgeProps {
  from: string
  to: string
  capacity: number
  flow?: number
  highlighted?: boolean
  highlightColor?: string
  isResidual?: boolean
  isBackEdge?: boolean
  delay?: number
  showFlow?: boolean
  showCapacity?: boolean
  saturated?: boolean
}

function computeEdgePath(fromId: string, toId: string, isBackEdge: boolean = false) {
  const fromNode = getNode(fromId)
  const toNode = getNode(toId)

  const dx = toNode.x - fromNode.x
  const dy = toNode.y - fromNode.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / dist
  const ny = dy / dist

  const fromRadius = fromNode.type === 'source' || fromNode.type === 'sink' ? 24 : 20
  const toRadius = toNode.type === 'source' || toNode.type === 'sink' ? 24 : 20

  const startX = fromNode.x + nx * (fromRadius + 4)
  const startY = fromNode.y + ny * (fromRadius + 4)
  const endX = toNode.x - nx * (toRadius + 8)
  const endY = toNode.y - ny * (toRadius + 8)

  // Curve offset for back edges or parallel edges
  const offset = isBackEdge ? 35 : 0
  const perpX = -ny * offset
  const perpY = nx * offset

  const midX = (startX + endX) / 2 + perpX
  const midY = (startY + endY) / 2 + perpY

  if (offset === 0) {
    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      labelX: midX,
      labelY: midY,
      angle: Math.atan2(dy, dx),
      endX,
      endY,
      startX,
      startY,
    }
  }

  return {
    path: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`,
    labelX: midX,
    labelY: midY,
    angle: Math.atan2(dy, dx),
    endX,
    endY,
    startX,
    startY,
  }
}

export function GraphEdgeComponent({
  from,
  to,
  capacity,
  flow = 0,
  highlighted = false,
  highlightColor = '#34d399',
  isResidual = false,
  isBackEdge = false,
  delay = 0,
  showFlow = false,
  showCapacity = true,
  saturated = false,
}: GraphEdgeProps) {
  const { path, labelX, labelY, endX, endY, startX, startY } = computeEdgePath(from, to, isBackEdge)

  const baseColor = isBackEdge ? '#c084fc' : isResidual ? '#34d399' : saturated ? '#f87171' : 'var(--color-zinc-600)'
  const color = highlighted ? highlightColor : baseColor

  const dx = endX - startX
  const dy = endY - startY
  const arrowAngle = Math.atan2(dy, dx)
  const arrowSize = 8
  const ax1 = endX - arrowSize * Math.cos(arrowAngle - Math.PI / 6)
  const ay1 = endY - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
  const ax2 = endX - arrowSize * Math.cos(arrowAngle + Math.PI / 6)
  const ay2 = endY - arrowSize * Math.sin(arrowAngle + Math.PI / 6)

  const labelText = showFlow ? `${flow}/${capacity}` : `${capacity}`
  const labelOffset = isBackEdge ? -16 : -10

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Edge glow for highlighted */}
      {highlighted && (
        <motion.path
          d={path}
          fill="none"
          stroke={highlightColor}
          strokeWidth={6}
          opacity={0.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay }}
          filter="url(#glow)"
        />
      )}

      {/* Back-edge glow */}
      {isBackEdge && (
        <motion.path
          d={path}
          fill="none"
          stroke="#c084fc"
          strokeWidth={8}
          opacity={0.25}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay, ease: 'easeOut' }}
          filter="url(#glow)"
        />
      )}

      {/* Edge path */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={highlighted ? 2.5 : isBackEdge ? 2.5 : 1.5}
        strokeDasharray={isResidual && isBackEdge ? '8 5' : 'none'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      />

      {/* Arrowhead */}
      <motion.polygon
        points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.4 }}
      />

      {/* Capacity / Flow label */}
      {showCapacity && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.3 }}
        >
          <rect
            x={labelX - 22}
            y={labelY + labelOffset - 10}
            width={44}
            height={20}
            rx={4}
            fill={isBackEdge ? 'rgba(30, 15, 40, 0.95)' : 'rgba(9, 9, 11, 0.9)'}
            stroke={isBackEdge ? 'rgba(192, 132, 252, 0.3)' : 'none'}
            strokeWidth={isBackEdge ? 1 : 0}
          />
          <text
            x={labelX}
            y={labelY + labelOffset}
            textAnchor="middle"
            dominantBaseline="central"
            fill={highlighted ? highlightColor : isBackEdge ? '#c084fc' : isResidual ? '#34d399' : showFlow && flow > 0 ? '#34d399' : 'var(--color-zinc-400)'}
            fontSize={13}
            fontFamily="var(--font-mono)"
            fontWeight={500}
          >
            {labelText}
          </text>
        </motion.g>
      )}
    </motion.g>
  )
}

export { computeEdgePath }
