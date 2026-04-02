import { lazy, Suspense } from 'react'
import { usePresentation } from './store/usePresentation'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { SlideLayout } from './layouts/SlideLayout'
import { TransitionWrapper } from './layouts/TransitionWrapper'
import { ITERATIONS } from './data/fordFulkersonSteps'

// Lazy-load all slides
const S00_Title = lazy(() => import('./components/slides/S00_Title').then(m => ({ default: m.S00_Title })))
const S01_ProblemIntro = lazy(() => import('./components/slides/S01_ProblemIntro').then(m => ({ default: m.S01_ProblemIntro })))
const S02_FlowNetwork = lazy(() => import('./components/slides/S02_FlowNetwork').then(m => ({ default: m.S02_FlowNetwork })))
const S03_FlowRules = lazy(() => import('./components/slides/S03_FlowRules').then(m => ({ default: m.S03_FlowRules })))
const S04_ResidualConcept = lazy(() => import('./components/slides/S04_ResidualConcept').then(m => ({ default: m.S04_ResidualConcept })))
const S05_ResidualNetwork = lazy(() => import('./components/slides/S05_ResidualNetwork').then(m => ({ default: m.S05_ResidualNetwork })))
const S06_BuildResidual = lazy(() => import('./components/slides/S06_BuildResidual').then(m => ({ default: m.S06_BuildResidual })))
const S07_AugmentingPath = lazy(() => import('./components/slides/S07_AugmentingPath').then(m => ({ default: m.S07_AugmentingPath })))
const S08_GreedyTrap = lazy(() => import('./components/slides/S08_GreedyTrap').then(m => ({ default: m.S08_GreedyTrap })))
const S09_FordFulkerson = lazy(() => import('./components/slides/S09_FordFulkerson').then(m => ({ default: m.S09_FordFulkerson })))
const S10_Iteration = lazy(() => import('./components/slides/S10_Iteration').then(m => ({ default: m.IterationSlide })))
const S13_AlgorithmComplete = lazy(() => import('./components/slides/S13_AlgorithmComplete').then(m => ({ default: m.S13_AlgorithmComplete })))
const S14_CutDefinition = lazy(() => import('./components/slides/S14_CutDefinition').then(m => ({ default: m.S14_CutDefinition })))
const S15_CutExamples = lazy(() => import('./components/slides/S15_CutExamples').then(m => ({ default: m.S15_CutExamples })))
const S16_FlowLeqCut = lazy(() => import('./components/slides/S16_FlowLeqCut').then(m => ({ default: m.S16_FlowLeqCut })))
const S17_MaxFlowMinCut = lazy(() => import('./components/slides/S17_MaxFlowMinCut').then(m => ({ default: m.S17_MaxFlowMinCut })))
const S18_Implementation = lazy(() => import('./components/slides/S18_Implementation').then(m => ({ default: m.S18_Implementation })))
const S19_QA = lazy(() => import('./components/slides/S19_QA').then(m => ({ default: m.S19_QA })))

const SLIDE_COMPONENTS = [
  () => <S00_Title />,
  () => <S01_ProblemIntro />,
  () => <S02_FlowNetwork />,
  () => <S03_FlowRules />,
  () => <S04_ResidualConcept />,
  () => <S05_ResidualNetwork />,
  () => <S06_BuildResidual />,
  () => <S07_AugmentingPath />,
  () => <S09_FordFulkerson />,
  () => <S08_GreedyTrap />,
  () => <S10_Iteration iteration={ITERATIONS[0]} />,
  () => <S10_Iteration iteration={ITERATIONS[1]} />,
  () => <S10_Iteration iteration={ITERATIONS[2]} isLast />,
  () => <S13_AlgorithmComplete />,
  () => <S14_CutDefinition />,
  () => <S15_CutExamples />,
  () => <S16_FlowLeqCut />,
  () => <S17_MaxFlowMinCut />,
  () => <S18_Implementation />,
  () => <S19_QA />,
]

function App() {
  useKeyboardNav()
  const currentSlide = usePresentation(s => s.currentSlide)

  const SlideRenderer = SLIDE_COMPONENTS[currentSlide]

  return (
    <SlideLayout>
      <TransitionWrapper slideKey={currentSlide}>
        <Suspense fallback={<div className="h-full" />}>
          <SlideRenderer />
        </Suspense>
      </TransitionWrapper>
    </SlideLayout>
  )
}

export default App
