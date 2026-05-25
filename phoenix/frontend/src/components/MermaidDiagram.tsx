import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: { primaryColor: '#06b6d4', background: '#1f2937' },
})

let idCounter = 0

export function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useRef(`mermaid-${++idCounter}`)

  useEffect(() => {
    if (!ref.current || !code) return
    const el = ref.current
    el.innerHTML = ''
    mermaid.render(id.current, code).then(({ svg }) => {
      el.innerHTML = svg
    }).catch((err) => {
      el.innerHTML = `<pre style="color:#f87171;font-size:12px">${err.message}</pre>`
    })
  }, [code])

  return (
    <Box
      ref={ref}
      bg="gray.900"
      p={4}
      borderRadius="lg"
      overflowX="auto"
      sx={{ '& svg': { maxWidth: '100%', height: 'auto' } }}
    />
  )
}
