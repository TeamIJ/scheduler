import '../../src/styles/globals.css'
import { AppProps } from 'next/app'

import { AuthProvider  } from '../contexts/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
