import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Box } from '@chakra-ui/react'

interface Props {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'java' }: Props) {
  return (
    <Box borderRadius="lg" overflow="hidden" fontSize="sm">
      <SyntaxHighlighter language={language} style={atomOneDark} customStyle={{ margin: 0, borderRadius: '8px' }}>
        {code}
      </SyntaxHighlighter>
    </Box>
  )
}
