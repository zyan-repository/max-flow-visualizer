import { motion } from 'framer-motion'

interface CodePanelProps {
  code: string
  language?: string
  activeLine?: number
  delay?: number
  className?: string
}

const KEYWORD_COLORS: Record<string, string> = {
  'def': '#c084fc',
  'if': '#c084fc',
  'else': '#c084fc',
  'while': '#c084fc',
  'return': '#c084fc',
  'for': '#c084fc',
  'in': '#c084fc',
  'not': '#c084fc',
  'and': '#c084fc',
  'or': '#c084fc',
  'True': '#fbbf24',
  'False': '#fbbf24',
  'None': '#fbbf24',
  'float': '#22d3ee',
  'int': '#22d3ee',
  'list': '#22d3ee',
  'dict': '#22d3ee',
  'from': '#c084fc',
  'import': '#c084fc',
  'class': '#c084fc',
  'break': '#c084fc',
  'continue': '#c084fc',
}

function highlightLine(line: string): string {
  // Highlight comments
  const commentIdx = line.indexOf('#')
  let code = line
  let comment = ''
  if (commentIdx >= 0) {
    code = line.slice(0, commentIdx)
    comment = `<span style="color: var(--color-zinc-600)">${line.slice(commentIdx)}</span>`
  }

  // Highlight strings
  code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #34d399">$&</span>')

  // Highlight numbers
  code = code.replace(/\b(\d+)\b/g, '<span style="color: #fbbf24">$&</span>')

  // Highlight keywords
  for (const [kw, color] of Object.entries(KEYWORD_COLORS)) {
    const regex = new RegExp(`\\b${kw}\\b`, 'g')
    code = code.replace(regex, `<span style="color: ${color}">${kw}</span>`)
  }

  return code + comment
}

export function CodePanel({ code, activeLine, delay = 0.3, className = '' }: CodePanelProps) {
  const lines = code.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay }}
      className={`rounded-xl border overflow-hidden ${className}`}
      style={{
        background: 'rgba(9, 9, 11, 0.95)',
        borderColor: 'var(--color-zinc-800)',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        lineHeight: '1.6',
      }}
    >
      <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: 'var(--color-zinc-800)' }}>
        <div className="w-3 h-3 rounded-full" style={{ background: '#f87171' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#fbbf24' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#34d399' }} />
        <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>max_flow.py</span>
      </div>
      <div className="px-4 py-3 overflow-x-auto">
        {lines.map((line, i) => {
          const lineNum = i + 1
          const isActive = activeLine === lineNum
          return (
            <div
              key={i}
              className="flex transition-all duration-200"
              style={{
                background: isActive ? 'rgba(52, 211, 153, 0.1)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                paddingLeft: '8px',
                marginLeft: '-10px',
              }}
            >
              <span
                className="w-8 text-right mr-4 select-none shrink-0"
                style={{ color: isActive ? 'var(--accent)' : 'var(--color-zinc-700)' }}
              >
                {lineNum}
              </span>
              <span
                dangerouslySetInnerHTML={{ __html: highlightLine(line) }}
                style={{ color: 'var(--color-zinc-300)', whiteSpace: 'pre' }}
              />
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
