import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMemo, type ReactNode } from 'react'

interface FormulaCardProps {
  latex: string
  label?: ReactNode
  delay?: number
  display?: boolean
  className?: string
}

export function FormulaCard({ latex, label, delay = 0.3, display = true, className = '' }: FormulaCardProps) {
  const html = useMemo(() => {
    return katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      trust: true,
    })
  }, [latex, display])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay }}
      className={`relative px-6 py-4 rounded-xl border ${className}`}
      style={{
        background: 'rgba(24, 24, 27, 0.8)',
        borderColor: 'var(--color-zinc-800)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {label && (
        <span
          className="block text-sm tracking-widest uppercase mb-2"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          {label}
        </span>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </motion.div>
  )
}

export function InlineMath({ latex }: { latex: string }) {
  const html = useMemo(() => {
    return katex.renderToString(latex, {
      displayMode: false,
      throwOnError: false,
    })
  }, [latex])

  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
