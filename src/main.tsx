import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './styles/reset.scss'
import AppRoutes from './Routes/routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <AppRoutes />
  </React.StrictMode>,
)
