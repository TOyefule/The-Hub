import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const theme = extendTheme({
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  styles: {
    global: {
      body: { bg: 'gray.950', color: 'white' },
    },
  },
  colors: {
    gray: {
      950: '#0a0e1a',
      900: '#111827',
      800: '#1f2937',
      700: '#374151',
    },
    brand: {
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
)
