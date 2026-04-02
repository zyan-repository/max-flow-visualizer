import type { FlowEdge, ResidualEdge, AugmentingPath, FordFulkersonIteration, FlowState, CutDefinition } from '../types/graph'
import { EDGES } from './exampleGraph'

// Pre-computed Ford-Fulkerson (Edmonds-Karp / BFS) iterations
// for the CLRS example graph with max flow = 23

function makeFlowEdges(flows: Record<string, number>): readonly FlowEdge[] {
  return EDGES.map(e => ({
    ...e,
    flow: flows[`${e.from}->${e.to}`] ?? 0,
  }))
}

function makeResidualEdges(flowEdges: readonly FlowEdge[]): readonly ResidualEdge[] {
  const residual: ResidualEdge[] = []
  for (const e of flowEdges) {
    const remaining = e.capacity - e.flow
    if (remaining > 0) {
      residual.push({
        from: e.from,
        to: e.to,
        capacity: remaining,
        isBackEdge: false,
        originalFrom: e.from,
        originalTo: e.to,
      })
    }
    if (e.flow > 0) {
      residual.push({
        from: e.to,
        to: e.from,
        capacity: e.flow,
        isBackEdge: true,
        originalFrom: e.from,
        originalTo: e.to,
      })
    }
  }
  return residual
}

// Initial state: zero flow
const INITIAL_FLOWS: Record<string, number> = {}
const INITIAL_FLOW_STATE: FlowState = {
  edges: makeFlowEdges(INITIAL_FLOWS),
  totalFlow: 0,
}

// Iteration 1: BFS finds s -> v1 -> v3 -> t
// Bottleneck: min(16, 12, 20) = 12
const ITER1_PATH: AugmentingPath = {
  path: ['s', 'v1', 'v3', 't'],
  bottleneck: 12,
  edgesOnPath: [
    { from: 's', to: 'v1', residualCapacity: 16 },
    { from: 'v1', to: 'v3', residualCapacity: 12 },
    { from: 'v3', to: 't', residualCapacity: 20 },
  ],
}

const AFTER_ITER1_FLOWS: Record<string, number> = {
  's->v1': 12,
  'v1->v3': 12,
  'v3->t': 12,
}
const AFTER_ITER1: FlowState = {
  edges: makeFlowEdges(AFTER_ITER1_FLOWS),
  totalFlow: 12,
}

// Iteration 2: BFS finds s -> v2 -> v4 -> t (shortest: 3 edges)
// Residual capacities: s->v2: 13, v2->v4: 14, v4->t: 4
// Bottleneck: min(13, 14, 4) = 4
const ITER2_PATH: AugmentingPath = {
  path: ['s', 'v2', 'v4', 't'],
  bottleneck: 4,
  edgesOnPath: [
    { from: 's', to: 'v2', residualCapacity: 13 },
    { from: 'v2', to: 'v4', residualCapacity: 14 },
    { from: 'v4', to: 't', residualCapacity: 4 },
  ],
}

const AFTER_ITER2_FLOWS: Record<string, number> = {
  's->v1': 12,
  's->v2': 4,
  'v1->v3': 12,
  'v2->v4': 4,
  'v3->t': 12,
  'v4->t': 4,
}
const AFTER_ITER2: FlowState = {
  edges: makeFlowEdges(AFTER_ITER2_FLOWS),
  totalFlow: 16,
}

// Iteration 3: BFS finds s -> v2 -> v4 -> v3 -> t (4 edges, v4->t now full)
// Residual capacities: s->v2: 9, v2->v4: 10, v4->v3: 7, v3->t: 8
// Bottleneck: min(9, 10, 7, 8) = 7
const ITER3_PATH: AugmentingPath = {
  path: ['s', 'v2', 'v4', 'v3', 't'],
  bottleneck: 7,
  edgesOnPath: [
    { from: 's', to: 'v2', residualCapacity: 9 },
    { from: 'v2', to: 'v4', residualCapacity: 10 },
    { from: 'v4', to: 'v3', residualCapacity: 7 },
    { from: 'v3', to: 't', residualCapacity: 8 },
  ],
}

const AFTER_ITER3_FLOWS: Record<string, number> = {
  's->v1': 12,
  's->v2': 11,
  'v1->v3': 12,
  'v2->v4': 11,
  'v3->t': 19,
  'v4->v3': 7,
  'v4->t': 4,
}
const AFTER_ITER3: FlowState = {
  edges: makeFlowEdges(AFTER_ITER3_FLOWS),
  totalFlow: 23,
}

export const ITERATIONS: readonly FordFulkersonIteration[] = [
  {
    iterationNumber: 1,
    flowBefore: INITIAL_FLOW_STATE,
    residualEdges: makeResidualEdges(INITIAL_FLOW_STATE.edges),
    augmentingPath: ITER1_PATH,
    flowAfter: AFTER_ITER1,
  },
  {
    iterationNumber: 2,
    flowBefore: AFTER_ITER1,
    residualEdges: makeResidualEdges(AFTER_ITER1.edges),
    augmentingPath: ITER2_PATH,
    flowAfter: AFTER_ITER2,
  },
  {
    iterationNumber: 3,
    flowBefore: AFTER_ITER2,
    residualEdges: makeResidualEdges(AFTER_ITER2.edges),
    augmentingPath: ITER3_PATH,
    flowAfter: AFTER_ITER3,
  },
]

export const FINAL_FLOW_STATE = AFTER_ITER3
export const FINAL_RESIDUAL = makeResidualEdges(AFTER_ITER3.edges)
export const MAX_FLOW_VALUE = 23

// Cut examples for Presenter 3
export const CUT_EXAMPLES: readonly CutDefinition[] = [
  // Cut 1: {s} vs {v1,v2,v3,v4,t} - capacity = 16 + 13 = 29
  {
    S: ['s'],
    T: ['v1', 'v2', 'v3', 'v4', 't'],
    cutEdges: [
      { from: 's', to: 'v1', capacity: 16 },
      { from: 's', to: 'v2', capacity: 13 },
    ],
    capacity: 29,
  },
  // Cut 2: {s,v1,v2} vs {v3,v4,t} - capacity = 12 + 14 = 26
  {
    S: ['s', 'v1', 'v2'],
    T: ['v3', 'v4', 't'],
    cutEdges: [
      { from: 'v1', to: 'v3', capacity: 12 },
      { from: 'v2', to: 'v4', capacity: 14 },
    ],
    capacity: 26,
  },
  // Min cut: {s,v1,v2,v4} vs {v3,t} - capacity = 12 + 7 + 4 = 23
  {
    S: ['s', 'v1', 'v2', 'v4'],
    T: ['v3', 't'],
    cutEdges: [
      { from: 'v1', to: 'v3', capacity: 12 },
      { from: 'v4', to: 'v3', capacity: 7 },
      { from: 'v4', to: 't', capacity: 4 },
    ],
    capacity: 23,
  },
]

export const MIN_CUT = CUT_EXAMPLES[2]
