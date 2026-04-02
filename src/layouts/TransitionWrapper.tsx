import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface TransitionWrapperProps {
  children: ReactNode
  slideKey: string | number
}

export function TransitionWrapper({ children, slideKey }: TransitionWrapperProps) {
  return (
    <motion.div
      key={slideKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
