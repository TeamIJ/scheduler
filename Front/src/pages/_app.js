import '../../src/styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider  } from '../contexts/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer position='top-center' autoClose={1500} />
    </AuthProvider>
  )
}
