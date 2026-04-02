import { motion, AnimatePresence } from 'framer-motion'
import { SlideBase, SlideHeading, SlideDescription, SlideAccent, SlideContext } from '../ui/SlideBase'
import { FormulaCard } from '../ui/FormulaCard'
import { FlowNetworkGraph } from '../graph/FlowNetworkGraph'
import { useT } from '../../hooks/useT'
import { usePresentation } from '../../store/usePresentation'

export function S02_FlowNetwork() {
  const t = useT()
  const subStep = usePresentation(s => s.subStep)

  return (
    <SlideBase>
      <SlideContext>{t({ en: 'Part 1: Residual Network', zh: '第一部分：残留网络' })}</SlideContext>
      <SlideHeading>
        {t({ en: 'Flow Network', zh: '流网络' })}
      </SlideHeading>

      <SlideDescription delay={0.2}>
        {t({
          en: <>A <SlideAccent>flow network</SlideAccent> is a directed graph G = (V, E) with a source s, sink t, and a non-negative capacity c(u,v) on each edge.</>,
          zh: <><SlideAccent>流网络</SlideAccent>是一个有向图 G = (V, E)，包含源点 s、汇点 t，每条边有非负容量 c(u,v)。</>,
        })}
      </SlideDescription>

      <motion.div
        className="mt-6 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FlowNetworkGraph delay={0.5} />
      </motion.div>

      <AnimatePresence>
        {subStep >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="mt-4 flex gap-4 flex-wrap justify-center"
          >
            <FormulaCard latex="G = (V, E)" label={t({ en: 'Graph', zh: '图' })} delay={0} />
            <FormulaCard latex={String.raw`c: E \to \mathbb{R}^+`} label={t({ en: 'Capacity', zh: '容量' })} delay={0.1} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {subStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="mt-4 flex gap-6 items-center justify-center text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#38bdf8' }} />
              <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                s = {t({ en: 'source', zh: '源点' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#f87171' }} />
              <span style={{ color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                t = {t({ en: 'sink', zh: '汇点' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#a1a1aa' }} />
              <span style={{ color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
                {t({ en: 'intermediate', zh: '中间节点' })}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SlideBase>
  )
}
