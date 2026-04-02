import { motion } from 'framer-motion'
import { getNode } from '../../data/exampleGraph'

interface BFSWaveProps {
  sourceId: string
  discoveredNodes: readonly string[]
  color?: string
  delay?: number
}

export function BFSWave({ sourceId, discoveredNodes, color = '#34d399', delay = 0 }: BFSWaveProps) {
  const source = getNode(sourceId)

  return (
    <g>
      {/* Expanding wave rings from source */}
      {[0, 1, 2].map(ring => (
        <motion.circle
          key={ring}
          cx={source.x}
          cy={source.y}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          initial={{ r: 20, opacity: 0.8 }}
          animate={{ r: 300, opacity: 0 }}
          transition={{
            duration: 2,
            delay: delay + ring * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Node discovery pulses */}
      {discoveredNodes.map((nodeId, i) => {
        const node = getNode(nodeId)
        return (
          <motion.circle
            key={nodeId}
            cx={node.x}
            cy={node.y}
            r={28}
            fill={`${color}20`}
            stroke={color}
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.3], scale: [0, 1.2, 1] }}
            transition={{
              duration: 0.6,
              delay: delay + 0.3 + i * 0.4,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </g>
  )
}
