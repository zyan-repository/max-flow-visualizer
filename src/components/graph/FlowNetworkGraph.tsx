import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { NODES, EDGES } from '../../data/exampleGraph'
import { GraphNodeComponent } from './GraphNode'
import { GraphEdgeComponent } from './GraphEdge'
import { FlowParticles } from './FlowParticles'
import type { FlowEdge, ResidualEdge, CutDefinition } from '../../types/graph'

interface FlowNetworkGraphProps {
  // What to show
  showNodes?: boolean | readonly string[]
  showEdges?: boolean
  flowEdges?: readonly FlowEdge[]
  residualEdges?: readonly ResidualEdge[]
  highlightedPath?: readonly string[]
  highlightColor?: string
  cut?: CutDefinition | null
  showFlow?: boolean
  showParticles?: boolean
  animateEntrance?: boolean
  delay?: number
  className?: string
  children?: ReactNode
  width?: number
  height?: number
}

export function FlowNetworkGraph({
  showNodes = true,
  showEdges = true,
  flowEdges,
  residualEdges,
  highlightedPath,
  highlightColor = '#34d399',
  cut = null,
  showFlow = false,
  showParticles = false,
  animateEntrance = true,
  delay = 0,
  className = '',
  children,
  width = 640,
  height = 400,
}: FlowNetworkGraphProps) {
  const visibleNodeIds = showNodes === true
    ? NODES.map(n => n.id)
    : Array.isArray(showNodes) ? showNodes as string[] : []

  const pathEdgeSet = new Set<string>()
  if (highlightedPath && highlightedPath.length > 1) {
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      pathEdgeSet.add(`${highlightedPath[i]}->${highlightedPath[i + 1]}`)
    }
  }

  const maxCapacity = Math.max(...EDGES.map(e => e.capacity))

  // Build set of cut edges for highlighting
  const cutEdgeSet = new Set<string>()
  if (cut) {
    for (const ce of cut.cutEdges) {
      cutEdgeSet.add(`${ce.from}->${ce.to}`)
    }
  }

  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      style={{ maxHeight: '55vh' }}
      initial={animateEntrance ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Render edges */}
      {showEdges && !residualEdges && EDGES.map((edge, i) => {
        const edgeKey = `${edge.from}->${edge.to}`
        const isOnPath = pathEdgeSet.has(edgeKey)
        const isCutEdge = cutEdgeSet.has(edgeKey)
        const flowEdge = flowEdges?.find(fe => fe.from === edge.from && fe.to === edge.to)
        const isSaturated = flowEdge ? flowEdge.flow >= flowEdge.capacity : false

        return (
          <GraphEdgeComponent
            key={edgeKey}
            from={edge.from}
            to={edge.to}
            capacity={edge.capacity}
            flow={flowEdge?.flow ?? 0}
            highlighted={isOnPath || isCutEdge}
            highlightColor={isCutEdge ? '#f87171' : highlightColor}
            delay={delay + i * 0.06}
            showFlow={showFlow}
            saturated={isSaturated}
          />
        )
      })}

      {/* Render residual edges */}
      {residualEdges?.map((edge, i) => {
        const edgeKey = `${edge.from}->${edge.to}${edge.isBackEdge ? '-back' : ''}`
        const isOnPath = pathEdgeSet.has(`${edge.from}->${edge.to}`)

        return (
          <GraphEdgeComponent
            key={edgeKey}
            from={edge.from}
            to={edge.to}
            capacity={edge.capacity}
            highlighted={isOnPath}
            highlightColor={highlightColor}
            isResidual
            isBackEdge={edge.isBackEdge}
            delay={delay + i * 0.05}
          />
        )
      })}

      {/* Flow particles */}
      {showParticles && flowEdges?.map(edge => {
        if (edge.flow <= 0) return null
        return (
          <FlowParticles
            key={`particles-${edge.from}-${edge.to}`}
            from={edge.from}
            to={edge.to}
            flow={edge.flow}
            maxCapacity={maxCapacity}
          />
        )
      })}

      {/* Custom children (BFSWave, CutLine, etc.) */}
      {children}

      {/* Render nodes */}
      {NODES.filter(n => visibleNodeIds.includes(n.id)).map((node, i) => {
        const isOnPath = highlightedPath?.includes(node.id) ?? false
        const cutSide = cut
          ? cut.S.includes(node.id) ? 'S' : cut.T.includes(node.id) ? 'T' : null
          : null

        return (
          <GraphNodeComponent
            key={node.id}
            node={node}
            highlighted={isOnPath}
            highlightColor={highlightColor}
            delay={delay + i * 0.08}
            cutSide={cutSide}
          />
        )
      })}
    </motion.svg>
  )
}
