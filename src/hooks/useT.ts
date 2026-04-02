import type { ReactNode } from 'react'
import { usePresentation } from '../store/usePresentation'

export function useT() {
  const locale = usePresentation(s => s.locale)
  return <T extends { en: ReactNode; zh: ReactNode }>(obj: T): ReactNode => obj[locale]
}
