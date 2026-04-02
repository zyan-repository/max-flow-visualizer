import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideContext } from '../ui/SlideBase'
import { CodePanel } from '../ui/CodePanel'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'

const IMPLEMENTATION = `from collections import deque

def bfs(graph, s, t, parent):
    visited = {s}
    queue = deque([s])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if v not in visited and graph[u][v] > 0:
                visited.add(v)
                parent[v] = u
                if v == t:
                    return True
                queue.append(v)
    return False

def max_flow(graph, s, t):
    # Build adjacency dict with residual capacities
    n = len(graph)
    rg = {}  # residual graph
    for u in graph:
        rg.setdefault(u, {})
        for v, cap in graph[u].items():
            rg[u][v] = cap
            rg.setdefault(v, {})
            rg[v].setdefault(u, 0)

    max_flow = 0

    while True:
        parent = {}
        if not bfs(rg, s, t, parent):
            break  # No augmenting path

        # Find bottleneck
        path_flow = float("inf")
        v = t
        while v != s:
            u = parent[v]
            path_flow = min(path_flow, rg[u][v])
            v = u

        # Update residual graph
        v = t
        while v != s:
            u = parent[v]
            rg[u][v] -= path_flow
            rg[v][u] += path_flow
            v = u

        max_flow += path_flow

    return max_flow`

const SUBSTEP_LINES: Record<number, number> = {
  0: 1,  // BFS function
  1: 4,  // BFS core
  2: 17, // max_flow start
  3: 31, // main while loop
  4: 35, // find bottleneck
  5: 42, // update residual
  6: 49, // return
}

export function S18_Implementation() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  const activeLine = SUBSTEP_LINES[subStep]

  const explanations = [
    { line: '1-15', title: t({ en: 'BFS Function', zh: 'BFS 函数' }), desc: t({ en: 'Standard BFS that finds a path from s to t in the residual graph. Records parent pointers for path reconstruction.', zh: '标准 BFS，在残留图中找从 s 到 t 的路径。记录父节点指针用于路径重建。' }) },
    { line: '4-14', title: t({ en: 'BFS Core', zh: 'BFS 核心' }), desc: t({ en: 'Only traverse edges with positive residual capacity (graph[u][v] > 0). This is the key difference from standard BFS!', zh: '只遍历残留容量为正的边 (graph[u][v] > 0)。这是与标准 BFS 的关键区别！' }) },
    { line: '17-28', title: t({ en: 'Setup', zh: '初始化' }), desc: t({ en: 'Build the residual graph. For each edge (u,v) with capacity c, also create back-edge (v,u) with initial capacity 0.', zh: '构建残留图。对每条边 (u,v) 容量 c，同时创建反向边 (v,u) 初始容量 0。' }) },
    { line: '31-33', title: t({ en: 'Main Loop', zh: '主循环' }), desc: t({ en: 'Keep finding augmenting paths via BFS. When BFS returns False, no more paths exist - we have max flow!', zh: '持续用 BFS 找增广路径。当 BFS 返回 False 时，没有更多路径——最大流已找到！' }) },
    { line: '35-40', title: t({ en: 'Find Bottleneck', zh: '找瓶颈' }), desc: t({ en: 'Walk backwards from t to s using parent pointers. The bottleneck is the minimum residual capacity on the path.', zh: '用父节点指针从 t 回溯到 s。瓶颈是路径上最小的残留容量。' }) },
    { line: '42-47', title: t({ en: 'Update Residual', zh: '更新残留' }), desc: t({ en: 'Walk the path again: decrease forward edges by bottleneck, increase back edges. This is where the magic happens!', zh: '再次遍历路径：正向边减少瓶颈值，反向边增加。这是算法的精髓！' }) },
    { line: '49', title: t({ en: 'Return', zh: '返回' }), desc: t({ en: 'Return the maximum flow. Time complexity: O(VE^2) using BFS.', zh: '返回最大流。使用 BFS 的时间复杂度：O(VE^2)。' }) },
  ]

  const currentExplanation = explanations[Math.min(subStep, explanations.length - 1)]

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 3: Implementation', zh: '第三部分：代码实现' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Writing the Code', zh: '编写代码' })}
      </SlideHeading>

      <div className="flex gap-6 mt-4 w-full max-w-6xl items-start">
        <div className="flex-1 max-h-[65vh] overflow-y-auto">
          <CodePanel
            code={IMPLEMENTATION}
            activeLine={activeLine}
            delay={0.2}
          />
        </div>

        <div className="w-64 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={subStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(24, 24, 27, 0.8)',
                border: '1px solid var(--color-zinc-800)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm px-1.5 py-0.5 rounded" style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  L{currentExplanation.line}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {currentExplanation.title}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {currentExplanation.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress */}
          <div className="flex gap-1 mt-2">
            {explanations.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{
                  background: i <= subStep ? '#34d399' : 'var(--color-zinc-800)',
                  opacity: i === subStep ? 1 : i < subStep ? 0.5 : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </SlideBase>
  )
}
