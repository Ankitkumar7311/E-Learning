<<<<<<< HEAD
// import "bootstrap/dist/css/bootstrap.min.css";
=======
>>>>>>> 577c1d5ea4954502c13d2b5e8c44ad05ff53c0e8
import "./index.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
