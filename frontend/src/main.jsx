import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/main.scss'
import Login from './pages/auth/Login.jsx'
import Search from './pages/search/Search.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Login /> */}
    <Search />
  </StrictMode>,
)
