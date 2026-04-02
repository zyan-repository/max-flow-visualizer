import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideContext } from '../ui/SlideBase'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { BFSWave } from '../graph/BFSWave'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'
import { FINAL_FLOW_STATE, FINAL_RESIDUAL, MIN_CUT, MAX_FLOW_VALUE } from '../../data/fordFulkersonSteps'

export function S17_MaxFlowMinCut() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  // SubSteps (5 total):
  // 0: Ford-Fulkerson stopped. Why? BFS can't reach t in Gf.
  // 1: BFS on final Gf: S = reachable, T = unreachable
  // 2: Key insight: all S->T edges are FULL (cf=0), so flow = cut capacity
  // 3: Show the cut on original graph with flow
  // 4: Conclusion: max flow = min cut = 23

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 3: Cut & Theorem', zh: '第三部分：割与定理' })}</SlideContext>
      <SlideHeading>
        <span style={{ color: '#34d399' }}>Max Flow</span> = <span style={{ color: '#fbbf24' }}>Min Cut</span>
      </SlideHeading>

      <div className="flex gap-6 mt-2 w-full max-w-6xl items-start">
        {/* Left: graph */}
        <div className="flex-1">
          {subStep <= 1 && (
            <div>
              <p className="text-sm mb-1 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {subStep === 0
                  ? t({ en: 'Final residual Gf (no s-t path exists!)', zh: '最终残留网络 Gf（不存在 s-t 路径！）' })
                  : t({ en: 'BFS from s: who can we reach?', zh: '从 s 做 BFS：能到达谁？' })
                }
              </p>
              <FlowNetworkGraph
                residualEdges={FINAL_RESIDUAL}
                animateEntrance={false}
                delay={0}
              >
                {subStep >= 1 && (
                  <BFSWave sourceId="s" discoveredNodes={MIN_CUT.S} color="#38bdf8" delay={0.2} />
                )}
              </FlowNetworkGraph>
              {subStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 flex gap-4 justify-center text-sm"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span><span style={{ color: '#38bdf8' }}>S</span> = {'{'}{MIN_CUT.S.join(', ')}{'}'} <span style={{ color: 'var(--text-muted)' }}>({t({ en: 'reachable', zh: '可达' })})</span></span>
                  <span><span style={{ color: '#fbbf24' }}>T</span> = {'{'}{MIN_CUT.T.join(', ')}{'}'} <span style={{ color: 'var(--text-muted)' }}>({t({ en: 'unreachable', zh: '不可达' })})</span></span>
                </motion.div>
              )}
            </div>
          )}

          {subStep >= 2 && subStep <= 3 && (
            <div>
              <p className="text-sm mb-1 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {t({ en: 'Original graph with final flow + min cut', zh: '原图 + 最终流 + 最小割' })}
              </p>
              <FlowNetworkGraph
                flowEdges={FINAL_FLOW_STATE.edges}
                showFlow
                cut={MIN_CUT}
                animateEntrance={false}
                delay={0}
              />
            </div>
          )}

          {subStep >= 4 && (
            <div>
              <p className="text-sm mb-1 text-center" style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                {t({ en: 'Max Flow = Min Cut!', zh: '最大流 = 最小割！' })}
              </p>
              <FlowNetworkGraph
                flowEdges={FINAL_FLOW_STATE.edges}
                showFlow
                showParticles
                cut={MIN_CUT}
                animateEntrance={false}
                delay={0}
              />
            </div>
          )}
        </div>

        {/* Right: step-by-step reasoning */}
        <div className="w-96 flex flex-col gap-3 shrink-0">
          {/* Step 0: algorithm stopped */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="px-5 py-3 rounded-xl"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}
          >
            <p className="text-base font-medium" style={{ color: '#f87171' }}>
              {t({ en: 'Ford-Fulkerson stopped!', zh: 'Ford-Fulkerson 停止了！' })}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t({
                en: 'BFS from s cannot reach t in Gf. No augmenting path exists.',
                zh: '在 Gf 中从 s 做 BFS 到不了 t。没有增广路径了。',
              })}
            </p>
          </motion.div>

          {/* Step 1: define S and T */}
          <AnimatePresence>
            {subStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="px-5 py-3 rounded-xl"
                style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)' }}
              >
                <p className="text-base font-medium" style={{ color: '#38bdf8' }}>
                  {t({ en: 'Define S and T from BFS', zh: '用 BFS 定义 S 和 T' })}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'S = nodes BFS can reach from s (via cf > 0 edges). T = the rest. Since t is unreachable, (S,T) is a valid cut!',
                    zh: 'S = BFS 从 s 能到的节点（走 cf > 0 的边）。T = 剩余节点。因为 t 不可达，(S,T) 是一个合法割！',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: KEY insight */}
          <AnimatePresence>
            {subStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="px-5 py-3 rounded-xl"
                style={{ background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.25)' }}
              >
                <p className="text-base font-medium" style={{ color: '#c084fc' }}>
                  {t({ en: 'Key insight: every S\u2192T edge is FULL!', zh: '关键：每条 S\u2192T 边都满载！' })}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'If any S\u2192T edge had remaining capacity (cf > 0), BFS could cross it and the node would be in S, not T. Contradiction! So every S\u2192T edge has flow = capacity.',
                    zh: '如果某条 S\u2192T 边还有剩余容量（cf > 0），BFS 就能走过去，那个节点就该在 S 里而不是 T 里。矛盾！所以每条 S\u2192T 边的流量 = 容量。',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: therefore */}
          <AnimatePresence>
            {subStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="px-5 py-3 rounded-xl"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}
              >
                <p className="text-base font-medium" style={{ color: '#fbbf24' }}>
                  {t({ en: 'Therefore: |f| = c(S,T)', zh: '因此：|f| = c(S,T)' })}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: 'All S\u2192T edges are full, so flow value = cut capacity.',
                    zh: '所有 S\u2192T 边都满载，所以流的值 = 割的容量。',
                  })}
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: '\u2022 f is max flow: we proved |f| \u2264 c(S\u2019,T\u2019) for ANY cut. No flow can exceed this cut\u2019s capacity, so f can\u2019t be improved.',
                    zh: '\u2022 f 是最大流：我们证过 |f| \u2264 c(S\u2019,T\u2019) 对任意割成立。没有流能超过这个割的容量，所以 f 不可能更大了。',
                  })}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t({
                    en: '\u2022 (S,T) is min cut: any other cut has c(S\u2019,T\u2019) \u2265 |f| = c(S,T). So no cut has smaller capacity.',
                    zh: '\u2022 (S,T) 是最小割：任意其他割 c(S\u2019,T\u2019) \u2265 |f| = c(S,T)。所以没有割的容量比它更小。',
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 4: result */}
          <AnimatePresence>
            {subStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="px-5 py-4 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(251,191,36,0.15))',
                  border: '1px solid rgba(52,211,153,0.3)',
                  boxShadow: '0 0 30px rgba(52,211,153,0.1)',
                }}
              >
                <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {t({ en: 'Max Flow = Min Cut', zh: '最大流 = 最小割' })}
                </span>
                <br />
                <span
                  className="text-4xl font-bold tabular-nums"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: 'linear-gradient(135deg, #34d399, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {MAX_FLOW_VALUE}
                </span>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  {t({
                    en: 'v1\u2192v3(12) + v4\u2192v3(7) + v4\u2192t(4) = 23',
                    zh: 'v1\u2192v3(12) + v4\u2192v3(7) + v4\u2192t(4) = 23',
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
