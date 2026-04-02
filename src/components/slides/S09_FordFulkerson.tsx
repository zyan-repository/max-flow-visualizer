import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { CodePanel } from '../ui/CodePanel'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'

const PSEUDOCODE = `def ford_fulkerson(G, s, t):
    # Initialize: zero flow on all edges
    for each edge (u, v) in G.E:
        f[u][v] = 0

    # Main loop: keep finding augmenting paths
    while exists augmenting path p in Gf:
        # Find bottleneck capacity
        cf_p = min(cf(u,v) for (u,v) in p)

        # Update flow along the path
        for each edge (u, v) in p:
            if (u, v) in E:       # forward edge
                f[u][v] += cf_p
            else:                  # back edge
                f[v][u] -= cf_p

    return f`

export function S09_FordFulkerson() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  const activeLine = subStep === 0 ? undefined
    : subStep === 1 ? 7
    : 14

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 2: Augmenting Path', zh: '第二部分：增广路径' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'The Ford-Fulkerson Method', zh: 'Ford-Fulkerson 方法' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>The idea is beautifully simple: <SlideAccent>while</SlideAccent> there exists an augmenting path in G_f, push flow along it.</>,
          zh: <>思想非常优雅：<SlideAccent>只要</SlideAccent>残留网络 G_f 中存在增广路径，就沿着它推送流。</>,
        })}
      </SlideDescription>

      <div className="flex gap-8 mt-6 w-full max-w-6xl items-start">
        <div className="flex-1">
          <CodePanel
            code={PSEUDOCODE}
            activeLine={activeLine}
            delay={0.3}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Step explanations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            {[
              {
                step: '1',
                color: '#38bdf8',
                text: t({ en: 'Initialize all flows to zero', zh: '初始化所有流为零' }),
                detail: t({ en: 'Start with no flow in the network', zh: '网络中没有任何流' }),
              },
              {
                step: '2',
                color: '#34d399',
                text: t({ en: 'Find augmenting path (BFS)', zh: '寻找增广路径（BFS）' }),
                detail: t({ en: 'Use BFS to find shortest s-t path in Gf', zh: '用 BFS 在 Gf 中找最短 s-t 路径' }),
              },
              {
                step: '3',
                color: '#fbbf24',
                text: t({ en: 'Push bottleneck flow along path', zh: '沿路径推送瓶颈流' }),
                detail: t({ en: 'Update forward and back edges', zh: '更新正向和反向边' }),
              },
              {
                step: '4',
                color: '#f87171',
                text: t({ en: 'Repeat until no path exists', zh: '重复直到无路径存在' }),
                detail: t({ en: 'No augmenting path = max flow reached!', zh: '无增广路径 = 最大流已达成！' }),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
                  style={{ background: `${item.color}20`, color: item.color, fontFamily: 'var(--font-mono)' }}
                >
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {subStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-3 rounded-lg"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                <p className="text-sm" style={{ color: '#34d399' }}>
                  {t({
                    en: "Let's run this on our example graph!",
                    zh: '让我们在示例图上运行这个算法！',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SlideBase>
  )
}
