import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Authprovider } from './context/AuthContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authprovider>
      <App />
    </Authprovider>
  </StrictMode>,
)
