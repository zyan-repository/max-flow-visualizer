import { useEffect } from 'react'
import { usePresentation } from '../store/usePresentation'

export function useKeyboardNav() {
  const { nextSubStep, prevSubStep, goToSlide, toggleLocale, toggleNotes } = usePresentation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          nextSubStep()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Backspace':
          e.preventDefault()
          prevSubStep()
          break
        case 'l':
        case 'L':
          toggleLocale()
          break
        case 'n':
        case 'N':
          toggleNotes()
          break
        default:
          if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
            e.preventDefault()
            goToSlide(parseInt(e.key) - 1)
          }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSubStep, prevSubStep, goToSlide, toggleLocale, toggleNotes])
}
