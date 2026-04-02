export interface GraphNode {
  readonly id: string
  readonly label: string
  readonly x: number
  readonly y: number
  readonly type: 'source' | 'sink' | 'normal'
}

export interface GraphEdge {
  readonly from: string
  readonly to: string
  readonly capacity: number
}

export interface FlowEdge extends GraphEdge {
  readonly flow: number
}

export interface ResidualEdge {
  readonly from: string
  readonly to: string
  readonly capacity: number
  readonly isBackEdge: boolean
  readonly originalFrom: string
  readonly originalTo: string
}

export interface FlowNetwork {
  readonly nodes: readonly GraphNode[]
  readonly edges: readonly GraphEdge[]
}

export interface FlowState {
  readonly edges: readonly FlowEdge[]
  readonly totalFlow: number
}

export interface AugmentingPath {
  readonly path: readonly string[]
  readonly bottleneck: number
  readonly edgesOnPath: readonly { from: string; to: string; residualCapacity: number }[]
}

export interface FordFulkersonIteration {
  readonly iterationNumber: number
  readonly flowBefore: FlowState
  readonly residualEdges: readonly ResidualEdge[]
  readonly augmentingPath: AugmentingPath
  readonly flowAfter: FlowState
}

export interface CutDefinition {
  readonly S: readonly string[]
  readonly T: readonly string[]
  readonly cutEdges: readonly { from: string; to: string; capacity: number }[]
  readonly capacity: number
}
