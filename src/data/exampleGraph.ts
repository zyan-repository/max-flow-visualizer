import type { GraphNode, GraphEdge, FlowNetwork } from '../types/graph'

// Classic CLRS-inspired 6-node flow network
// Layout: two columns with source on left, sink on right
//
//     s --16--> v1 --12--> v3 --20--> t
//     |         |^         ^|
//     13        4|4        9|7
//     v         v|         |v
//     s --13--> v2 --14--> v4 ---4--> t
//
// Node positions for SVG rendering (normalized 0-600 x, 0-400 y)

export const NODES: readonly GraphNode[] = [
  { id: 's', label: 's', x: 60, y: 200, type: 'source' },
  { id: 'v1', label: 'v\u2081', x: 220, y: 80, type: 'normal' },
  { id: 'v2', label: 'v\u2082', x: 220, y: 320, type: 'normal' },
  { id: 'v3', label: 'v\u2083', x: 420, y: 80, type: 'normal' },
  { id: 'v4', label: 'v\u2084', x: 420, y: 320, type: 'normal' },
  { id: 't', label: 't', x: 580, y: 200, type: 'sink' },
]

export const EDGES: readonly GraphEdge[] = [
  { from: 's', to: 'v1', capacity: 16 },
  { from: 's', to: 'v2', capacity: 13 },
  { from: 'v1', to: 'v2', capacity: 4 },
  { from: 'v1', to: 'v3', capacity: 12 },
  { from: 'v2', to: 'v1', capacity: 4 },
  { from: 'v2', to: 'v4', capacity: 14 },
  { from: 'v3', to: 'v2', capacity: 9 },
  { from: 'v3', to: 't', capacity: 20 },
  { from: 'v4', to: 'v3', capacity: 7 },
  { from: 'v4', to: 't', capacity: 4 },
]

export const FLOW_NETWORK: FlowNetwork = {
  nodes: NODES,
  edges: EDGES,
}

// Helper: get node by id
export function getNode(id: string): GraphNode {
  const node = NODES.find(n => n.id === id)
  if (!node) throw new Error(`Node ${id} not found`)
  return node
}

// Helper: get edge capacity
export function getCapacity(from: string, to: string): number {
  const edge = EDGES.find(e => e.from === from && e.to === to)
  return edge ? edge.capacity : 0
}
