import type { SlideConfig } from '../types/slide'

export const SLIDES: readonly SlideConfig[] = [
  // Presenter 1: Residual Network (sky-400)
  { id: 'title', title: { en: 'Maximum Flow', zh: '最大流' }, presenter: 1, durationHint: 30, maxSubStep: 0 },
  { id: 'problem_intro', title: { en: 'A Real-World Problem', zh: '一个现实问题' }, presenter: 1, durationHint: 60, maxSubStep: 0 },
  { id: 'flow_network', title: { en: 'Flow Network', zh: '流网络' }, presenter: 1, durationHint: 90, maxSubStep: 2 },
  { id: 'flow_rules', title: { en: 'Rules of Flow', zh: '流的规则' }, presenter: 1, durationHint: 90, maxSubStep: 2 },
  { id: 'residual_concept', title: { en: 'Residual Capacity', zh: '残留容量' }, presenter: 1, durationHint: 120, maxSubStep: 3 },
  { id: 'residual_network', title: { en: 'Residual Network', zh: '残留网络' }, presenter: 1, durationHint: 90, maxSubStep: 2 },
  { id: 'build_residual', title: { en: 'Building Gf', zh: '构建残留网络' }, presenter: 1, durationHint: 120, maxSubStep: 4 },

  // Presenter 2: Augmenting Path + Ford-Fulkerson (emerald-400)
  { id: 'augmenting_path', title: { en: 'Augmenting Path', zh: '增广路径' }, presenter: 2, durationHint: 90, maxSubStep: 2 },
  { id: 'ford_fulkerson', title: { en: 'Ford-Fulkerson Method', zh: 'Ford-Fulkerson 方法' }, presenter: 2, durationHint: 90, maxSubStep: 2 },
  { id: 'greedy_trap', title: { en: 'Why Back-Edges?', zh: '为什么需要反向边?' }, presenter: 2, durationHint: 90, maxSubStep: 3 },
  { id: 'iteration_1', title: { en: 'Iteration 1', zh: '第一轮迭代' }, presenter: 2, durationHint: 120, maxSubStep: 5 },
  { id: 'iteration_2', title: { en: 'Iteration 2', zh: '第二轮迭代' }, presenter: 2, durationHint: 120, maxSubStep: 5 },
  { id: 'iteration_3', title: { en: 'Iteration 3', zh: '第三轮迭代' }, presenter: 2, durationHint: 120, maxSubStep: 5 },
  { id: 'algorithm_complete', title: { en: 'Max Flow Reached!', zh: '最大流已达成!' }, presenter: 2, durationHint: 60, maxSubStep: 0 },

  // Presenter 3: Cut + Max-Flow Min-Cut (amber-400)
  { id: 'cut_definition', title: { en: 'What is a Cut?', zh: '什么是割?' }, presenter: 3, durationHint: 90, maxSubStep: 2 },
  { id: 'cut_examples', title: { en: 'Comparing Cuts', zh: '比较不同的割' }, presenter: 3, durationHint: 90, maxSubStep: 2 },
  { id: 'flow_leq_cut', title: { en: 'Flow <= Cut', zh: '流 <= 割' }, presenter: 3, durationHint: 90, maxSubStep: 2 },
  { id: 'max_flow_min_cut', title: { en: 'The Theorem', zh: '最大流最小割定理' }, presenter: 3, durationHint: 120, maxSubStep: 4 },
  { id: 'implementation', title: { en: 'Writing the Code', zh: '编写代码' }, presenter: 3, durationHint: 180, maxSubStep: 6 },
  { id: 'qa', title: { en: 'Summary & Q&A', zh: '总结与问答' }, presenter: 3, durationHint: 60, maxSubStep: 0 },
] as const
