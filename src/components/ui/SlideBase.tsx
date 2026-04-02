import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const springIn = { type: 'spring' as const, stiffness: 200, damping: 25 }

export function SlideBase({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center h-full px-12 py-10 w-full ${className}`}>
      {children}
    </div>
  )
}

export function SlideHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springIn, delay: 0.1 }}
      className={`text-6xl font-medium tracking-tight mb-6 ${className}`}
      style={{ letterSpacing: '-0.02em' }}
    >
      {children}
    </motion.h1>
  )
}

export function SlideDescription({ children, delay = 0.2, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springIn, delay }}
      className={`text-xl leading-relaxed max-w-4xl text-center ${className}`}
      style={{ color: 'var(--text-secondary)' }}
    >
      {children}
    </motion.p>
  )
}

export function SlideAccent({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--accent)' }}>{children}</span>
}

export function SlideBridge({ children, delay = 0.6 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="text-base mt-8 tracking-widest uppercase"
      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
    >
      {children}
    </motion.p>
  )
}

export function SlideContext({ children, delay = 0.3 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className="text-sm tracking-widest uppercase mb-4"
      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
    >
      {children}
    </motion.p>
  )
}
