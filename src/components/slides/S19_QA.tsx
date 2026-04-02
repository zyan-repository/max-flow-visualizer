import { motion } from 'framer-motion'
import { SlideBase, SlideHeading } from '../ui/SlideBase'
import { useT } from '../../hooks/useT'

export function S19_QA() {
  const t = useT()

  const takeaways = [
    {
      icon: '\u{1F30A}',
      title: t({ en: 'Residual Network', zh: '残留网络' }),
      desc: t({ en: 'Shows remaining capacity + undo options (back-edges)', zh: '展示剩余容量 + 回退选项（反向边）' }),
      color: '#38bdf8',
    },
    {
      icon: '\u{1F6A3}',
      title: t({ en: 'Augmenting Path', zh: '增广路径' }),
      desc: t({ en: 's->t path in Gf with positive capacity. Use BFS to find it, O(VE^2)', zh: 'Gf 中 s->t 正容量路径。用 BFS 查找，O(VE^2)' }),
      color: '#34d399',
    },
    {
      icon: '\u{2702}',
      title: t({ en: 'Max-Flow = Min-Cut', zh: '最大流 = 最小割' }),
      desc: t({ en: 'Maximum flow equals minimum cut capacity. Algorithm terminates when no path exists.', zh: '最大流等于最小割容量。算法在无增广路径时终止。' }),
      color: '#fbbf24',
    },
  ]

  return (
    <SlideBase className="relative">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.06) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      <SlideHeading>
        {t({ en: 'Key Takeaways', zh: '核心要点' })}
      </SlideHeading>

      <div className="flex gap-6 mt-8 max-w-5xl">
        {takeaways.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.3 + i * 0.2 }}
            className="flex-1 px-5 py-5 rounded-xl border"
            style={{
              background: `rgba(24, 24, 27, 0.6)`,
              borderColor: `${item.color}30`,
            }}
          >
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="text-base font-medium mb-2" style={{ color: item.color }}>
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 text-center"
      >
        <h2 className="text-3xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {t({ en: 'Questions?', zh: '提问环节' })}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {t({ en: 'Thank you!', zh: '谢谢！' })}
        </p>
      </motion.div>
    </SlideBase>
  )
}
