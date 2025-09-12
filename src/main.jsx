
import "./index.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import FindmaterialPop from './components/find/FindmaterialPop.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
